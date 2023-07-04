$.getJSON("https://api.ipify.org?format=json", function (data) {
  document.getElementById("ipData").textContent = `${data.ip}`;
  
});

function getUserInfo() {
  document.getElementById("getDataButton").style.display = "none";
  fetch("https://api.ipify.org/?format=json")
    .then((res) => res.json())
    .then((data) => {
      const ipAddress = data.ip;
      fetch(`https://ipinfo.io/${ipAddress}/json?token=a3bcdf7b9a71f5`)
        .then((response) => response.json())
        .then((data) => {
          const ip = data.ip;
          const lat = data.loc.split(",")[0];
          const lon = data.loc.split(",")[1];
          const timezone = data.timezone;
          const pincode = data.postal;

          // Clear previous data
          const ipDetails = document.querySelector(".ipDetails");
          ipDetails.innerHTML = "";

          const mapDiv = document.getElementById("map");
          mapDiv.innerHTML = "";

          const timezoneElement = document.getElementById("timezone");
          timezoneElement.innerHTML = "";

          const postOfficeList = document.getElementById("postOfficeList");
          postOfficeList.innerHTML = "";

          const searchBar = document.getElementById("searchBoxed");
          searchBar.innerHTML = "";

          document.getElementById("ipData").textContent = `${ip}`;

          showLocationOnMap(lat, lon, data);
          showTimezone(timezone, pincode);
          getPostOffices(pincode);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    });
}

function showLocationOnMap(lat, lon, data) {
  const mapDiv = document.getElementById("map");
  mapDiv.classList.add("map");
  const mapUrl = `<iframe src="https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed" width="100%" height="100%"></iframe>`;

  const btn = document.querySelector(".btn");
  btn.classList.add("removeBtn");

  const ipDetails = document.querySelector(".ipDetails");
  ipDetails.innerHTML += `
      <ul>
        <li><b>Lat:</b> ${lat}</li>
        <li><b>Long:</b> ${lon}</li>
      </ul>
      <ul>
        <li><b>City:</b> ${data.city}</li>
        <li><b>Region:</b> ${data.region}</li>
      </ul>
      <ul>
        <li><b>Organisation:</b> ${data.org}</li>
        <li><b>Hostname:</b> ${location.hostname}</li>
      </ul>
  `;

  mapDiv.innerHTML = mapUrl;
}

function showTimezone(timezone, pincode) {
  var pincodeCount = 0;
  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => response.json())
    .then((data) => {
      const postOffices = data[0].PostOffice;
      postOffices.forEach((element) => {
        pincodeCount++;
      });

      const timezoneElement = document.getElementById("timezone");
      let currentTime = new Date().toLocaleString("en-US", {
        timeZone: timezone,
      });

      timezoneElement.innerHTML += `
      <p class="second"><b>Time Zone:</b> ${timezone}</p>
      <p class="second"><b>Date And Time:</b> ${currentTime}</p>
      <p class="second"><b>Pincode:</b> ${pincode}</p>
      <p class="second"><b>Message:</b> Number of pincode(s) found: ${pincodeCount}</p>
    `;
    });
}

function getPostOffices(pincode) {
  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => response.json())
    .then((data) => {
      const postOffices = data[0].PostOffice;
      const postOfficeList = document.getElementById("postOfficeList");
      postOfficeList.innerHTML = "";

      postOffices.forEach((postOffice) => {
        postOfficeList.innerHTML += `
        <ul>
            <li><b>Name:</b> ${postOffice.Name}</li>
            <li><b>Branch Type:</b> ${postOffice.BranchType}</li>
            <li><b>Delivery Status:</b> ${postOffice.DeliveryStatus}</li>
            <li><b>District:</b> ${postOffice.District}</li>
            <li><b>Division:</b> ${postOffice.Division}</li>
        </ul>
        `;
      });

      const searchBar = document.getElementById("searchBoxed");
      searchBar.innerHTML = `
            <input
            type="text"
            name="prodSearch"
            id="searchBox"
            placeholder="Filter"
            oninput="filterPostOffices()"
            />
                
        `;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function filterPostOffices() {
  const searchBox = document.getElementById("searchBox");

  const filter = searchBox.value.toUpperCase();
  const postOfficeList = document.getElementById("postOfficeList");

  const listItems = postOfficeList.getElementsByTagName("ul");

  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    console.log(listItem);
    const text = listItem.textContent || listItem.innerText;
    if (text.toUpperCase().indexOf(filter) > -1) {
      listItem.style.display = "";
    } else {
      listItem.style.display = "none";
    }
  }
}