const CLIENT_ID = "<CLIENT_ID>";
const API_KEY = "<API_KEY>";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let tokenClient;
let accessToken = null;

window.onload = () => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.onload = initializeTokenClient;
  document.body.appendChild(script);
};

function initializeTokenClient() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        console.error("OAuth 2.0 error:", response.error);
        return;
      }
      accessToken = response.access_token;
      document.getElementById("sign_in").style.display = "none";
      document.getElementById("sign_out").style.display = "block";
      document.getElementById("inputs").style.display = "block";
    },
  });
}

function handleAuthClick() {
  tokenClient.requestAccessToken();
}

function handleSignoutClick() {
  accessToken = null;
  google.accounts.oauth2.revoke(tokenClient.getAccessToken());
  document.getElementById("sign_in").style.display = "block";
  document.getElementById("sign_out").style.display = "none";
  document.getElementById("inputs").style.display = "none";
  document.getElementById("output").innerText = "";
}

async function getBusyTimes() {
  const calendarId = document.getElementById("calendar_id").value;
  const timeMin = document.getElementById("time_min").value;
  const timeMax = document.getElementById("time_max").value;
  const outputDiv = document.getElementById("output");

  if (!calendarId || !timeMin || !timeMax) {
    outputDiv.innerHTML = '<p style="color: red;">All fields are required.</p>';
    return;
  }

  const requestBody = {
    timeMin: new Date(timeMin).toISOString(),
    timeMax: new Date(timeMax).toISOString(),
    items: [{ id: calendarId }],
  };

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/freeBusy?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error("API Error: " + response.statusText);
    }

    const data = await response.json();
    const busyIntervals = data.calendars[calendarId]?.busy || [];

    if (busyIntervals.length === 0) {
      outputDiv.innerHTML = "<p>No busy times found.</p>";
    } else {
      const formattedBusyTimes = busyIntervals
        .map(
          (interval) => `<p>Start: ${interval.start} - End: ${interval.end}</p>`
        )
        .join("");
      outputDiv.innerHTML = `<h3>Busy Times:</h3>${formattedBusyTimes}`;
    }
  } catch (error) {
    outputDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
    console.error(error);
  }
}

// Implementation - without user authentication

// const getBusyIntervals = async (
//   apiKey,
//   calendarId,
//   startDay,
//   startTime,
//   endDay,
//   endTime
// ) => {
//   const url = "https://www.googleapis.com/calendar/v3/freeBusy";

//   const timeMin = `${startDay}T${startTime}Z`;
//   const timeMax = `${endDay}T${endTime}Z`;

//   const requestBody = {
//     timeMin,
//     timeMax,
//     timeZone: "IST",
//     items: [
//       {
//         id: calendarId,
//       },
//     ],
//   };

//   try {
//     const response = await fetch(`${url}?key=${apiKey}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     });

//     if (response.ok) {
//       const data = await response.json();

//       const busyIntervals = data.calendars[calendarId].busy;

//       return busyIntervals;
//     } else {
//       throw new Error("Error: ", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching busy intervals: ", error);
//     return [];
//   }
// };

// const busyIntervals = await getBusyIntervals(
//   "<API-KEY>",
//   "<CALENDAR-ID>",
//   "2024-12-16",
//   "00:00:00",
//   "2024-12-16",
//   "23:59:59"
// );

// console.log("Busy intervals: ", busyIntervals);
