const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const targetCities = [
      "盛岡市",
      "宮古市",
      "北上市",
      "久慈市",
      "二戸市",
      "奥州市",
      "葛巻町",
      "平泉町",
      "一戸町",
    ];
    const cityList = ref(["すべて", ...targetCities]);

    const csvSources = targetCities.map((city) => {
      return {
        file: `./data/${city}.csv`,
        cityName: city,
        encoding: "UTF-8",
      };
    });

    const aedCount = ref(0);
    const selectedCity = ref("すべて");
    const isSearching = ref(false);
    const showModal = ref(false);

    let map = null;
    let markerGroup = null;
    let userLocationGroup = null;
    let allAedData = [];

    const createPopupHTML = (name, address, locationDetail, lat, lng) => {
      const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
      return `
        <div style="font-size: 14px; min-width: 180px;">
          <h3 style="margin: 0 0 5px 0; font-size: 16px;">${name}</h3>
          <p style="margin: 0 0 5px 0; color: #555;">📍 ${address}</p>
          ${locationDetail}
          <div style="display: flex; gap: 8px; flex-direction: column;">
            <a href="${routeUrl}" target="_blank" style="display: block; text-align: center; padding: 6px; background: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">🚗 ここへ行く</a>
            <a href="${streetViewUrl}" target="_blank" style="display: block; text-align: center; padding: 6px; background: #34A853; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">👀 景色を見る</a>
          </div>
        </div>
      `;
    };

    const updateMap = () => {
      markerGroup.clearLayers();
      if (userLocationGroup) userLocationGroup.clearLayers();

      const filteredData =
        selectedCity.value === "すべて"
          ? allAedData
          : allAedData.filter((row) => row.cityTag === selectedCity.value);

      aedCount.value = filteredData.length;
      let bounds = [];

      filteredData.forEach((row) => {
        const lat = parseFloat(
          row["緯度"] || row["Y"] || row["緯度（十進法）"],
        );
        const lng = parseFloat(
          row["経度"] || row["X"] || row["経度（十進法）"],
        );
        const name =
          row["名称"] || row["施設名"] || row["設置施設名"] || "名称不明";
        const address = row["住所"] || row["所在地"] || "";
        const locationDetail = row["設置位置"]
          ? `<p style="margin: 0 0 10px 0; color: #d32f2f; font-weight: bold;">🏥 設置位置: ${row["設置位置"]}</p>`
          : "";

        if (!isNaN(lat) && !isNaN(lng)) {
          const popupContent = createPopupHTML(
            name,
            address,
            locationDetail,
            lat,
            lng,
          );
          row.markerInstance = L.marker([lat, lng]).bindPopup(popupContent);
          markerGroup.addLayer(row.markerInstance);
          bounds.push([lat, lng]);
        }
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    const findNearestAED = () => {
      if (!navigator.geolocation) {
        alert("お使いのブラウザは現在地取得に対応していません。");
        return;
      }
      isSearching.value = true;
      userLocationGroup.clearLayers();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          isSearching.value = false;
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const userLatLng = L.latLng(userLat, userLng);

          L.circleMarker(userLatLng, {
            radius: 10,
            color: "white",
            weight: 3,
            fillColor: "#4285F4",
            fillOpacity: 1,
          })
            .addTo(userLocationGroup)
            .bindPopup("<b>あなたの現在地</b>")
            .openPopup();

          let nearestAED = null;
          let minDistance = Infinity;
          let nearestLatLng = null;

          const currentData =
            selectedCity.value === "すべて"
              ? allAedData
              : allAedData.filter((row) => row.cityTag === selectedCity.value);

          currentData.forEach((row) => {
            const lat = parseFloat(
              row["緯度"] || row["Y"] || row["緯度（十進法）"],
            );
            const lng = parseFloat(
              row["経度"] || row["X"] || row["経度（十進法）"],
            );
            if (!isNaN(lat) && !isNaN(lng)) {
              const aedLatLng = L.latLng(lat, lng);
              const distance = map.distance(userLatLng, aedLatLng);
              if (distance < minDistance) {
                minDistance = distance;
                nearestAED = row;
                nearestLatLng = aedLatLng;
              }
            }
          });

          if (nearestAED && nearestLatLng) {
            L.polyline([userLatLng, nearestLatLng], {
              color: "#d32f2f",
              weight: 4,
              dashArray: "10, 10",
            }).addTo(userLocationGroup);
            map.fitBounds(L.latLngBounds([userLatLng, nearestLatLng]), {
              padding: [80, 80],
            });
            if (nearestAED.markerInstance)
              nearestAED.markerInstance.openPopup();
          }
        },
        (error) => {
          isSearching.value = false;
          alert(
            "現在地を取得できませんでした。ブラウザの「位置情報の許可」設定を確認してください。",
          );
        },
        { enableHighAccuracy: true },
      );
    };

    const appUrl = "http://localhost/api-test/";
    const shareText =
      "「岩手県広域AEDマップ」で最寄りのAEDを確認しました！いざという時のためにホーム画面に追加しておこう！🚑🗺️";

    const shareOnX = () => {
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
      window.open(xUrl, "_blank", "width=600,height=400");
    };

    const shareOnLine = () => {
      const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(lineUrl, "_blank", "width=600,height=500");
    };

    onMounted(() => {
      map = L.map("map").setView([39.5, 141.15], 9);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      markerGroup = L.layerGroup().addTo(map);
      userLocationGroup = L.layerGroup().addTo(map);
      let loadedFilesCount = 0;

      csvSources.forEach((source) => {
        Papa.parse(source.file, {
          download: true,
          header: true,
          skipEmptyLines: true,
          encoding: source.encoding,
          complete: function (results) {
            const dataWithTag = results.data.map((row) => ({
              ...row,
              cityTag: source.cityName,
            }));
            allAedData = allAedData.concat(dataWithTag);
            loadedFilesCount++;

            if (loadedFilesCount === csvSources.length) {
              updateMap();
              console.log("🕵️‍♂️ はぐれAEDの公開取り調べを開始します...");
              console.table(
                allAedData
                  .filter((row) => {
                    const lat = parseFloat(
                      row["緯度"] || row["Y"] || row["緯度（十進法）"],
                    );
                    return lat < 38.5;
                  })
                  .map((row) => ({
                    施設名: row["名称"] || row["施設名"] || row["設置施設名"],
                    犯人の市: row.cityTag,
                    緯度: row["緯度"] || row["Y"],
                    経度: row["経度"] || row["X"],
                  })),
              );
            }
          },
        });
      });
    });

    return {
      aedCount,
      selectedCity,
      cityList,
      updateMap,
      findNearestAED,
      isSearching,
      shareOnX,
      shareOnLine,
      showModal,
    };
  },
}).mount("#app");
