import { Typography } from "@mui/material";
import "./App.css";
import "./Style.css";
import Container from "@mui/material/Container";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  const [Language, setLanguage] = useState("en");
  const [date, setDate] = useState("");
  const [temp, setTemp] = useState({
    tempruture: null,
    feelsLike: null,
    minTemp: null,
    maxTemp: null,
    humidity: null,
  });

  // تحويل الارقام لانجليزي ↔ عربي
  const toArabicNumbers = (num) => {
    return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  };

  useEffect(() => {
    if (Language === "ar") {
      setDate(toArabicNumbers(dayjs().locale("ar").format("D MMMM YYYY")));
    } else {
      setDate(dayjs().locale("en").format("D MMMM YYYY"));
    }

    axios
      .get(
        "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cairo/2025-08-27?unitGroup=metric&elements=tempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity&key=FNTBC938EMGQAZC3Y3TZH26RU&contentType=json"
      )
      .then(function (response) {
        const responseTemp = response.data.currentConditions.temp;
        const responseFeelsLike = response.data.currentConditions.feelslike;
        const responseHumidity = response.data.currentConditions.humidity;
        const responseMinTemp = response.data.days[0].tempmin;
        const responseMaxTemp = response.data.days[0].tempmax;

        setTemp({
          tempruture: responseTemp,
          feelsLike: responseFeelsLike,
          minTemp: responseMinTemp,
          maxTemp: responseMaxTemp,
          humidity: responseHumidity,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [Language]);

  function changeLanguage() {
    if (Language === "en") {
      setLanguage("ar");
      i18n.changeLanguage("ar");
    } else {
      setLanguage("en");
      i18n.changeLanguage("en");
    }
  }

  return (
    <>
      <Container maxWidth="sm">
        <div className="Card">
          <div className="Header">
            <Typography variant="h6">{date}</Typography>
            <Typography style={{ cursor: "pointer" }} variant="h2">
              {t("Cairo")}
            </Typography>
          </div>
          <hr />
          <div className="Body">
            <div className="Temperature">
              <Typography variant="h1">
                {" "}
                {Language === "ar"
                  ? toArabicNumbers(temp.tempruture)
                  : temp.tempruture}
                °C
              </Typography>
              <Typography
                style={{
                  marginBottom: "20px",
                  fontWeight: "300",
                  fontSize: "20px",
                }}
                variant="h5"
              >
                {t("Feels Like")} :{" "}
                {Language === "ar"
                  ? toArabicNumbers(temp.feelsLike)
                  : temp.feelsLike}
                {Language === "en" ? "°C" : ""}
              </Typography>

              <Typography
                style={{
                  marginBottom: "20px",
                  fontWeight: "300",
                  fontSize: "20px",
                }}
                variant="h5"
              >
                {t("Humidity")} :{" "}
                {Language === "ar"
                  ? toArabicNumbers(temp.humidity)
                  : temp.humidity}{" "}
                {Language === "en" ? "%" : ""}
              </Typography>

              <div className="Min-Max-Temp">
                <Typography variant="body2">
                  {t("Min")} :{" "}
                  {Language === "ar"
                    ? toArabicNumbers(temp.minTemp)
                    : temp.minTemp}{" "}
                  {Language === "en" ? "°C" : ""}
                </Typography>
                <span>|</span>
                <Typography variant="body2">
                  {t("Max")} :{" "}
                  {Language === "ar"
                    ? toArabicNumbers(temp.maxTemp)
                    : temp.maxTemp}{" "}
                  {Language === "en" ? "°C" : ""}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={changeLanguage}
          style={{
            marginTop: "10px",
            display: "block",
            marginRight: "100px",
            backgroundColor: "transparent",
          }}
        >
          <Typography variant="button">
            {Language === "en" ? "Change Language" : "تغيير اللغة"}
          </Typography>
        </button>
      </Container>
    </>
  );
}

export default App;
