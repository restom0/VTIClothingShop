import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function CountrySelect() {
  return (
    <Autocomplete
      id="country-select-demo"
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={key}
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
            />
            {option.label} ({option.code})
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const countries = [
  { code: "AD", label: "Andorra" },
  {
    code: "AE",
    label: "United Arab Emirates",
    phone: "971",
  },
  { code: "AF", label: "Afghanistan" },
  {
    code: "AG",
    label: "Antigua and Barbuda",
    phone: "1-268",
  },
  { code: "AI", label: "Anguilla" },
  { code: "AL", label: "Albania" },
  { code: "AM", label: "Armenia" },
  { code: "AO", label: "Angola" },
  { code: "AQ", label: "Antarctica" },
  { code: "AR", label: "Argentina" },
  { code: "AS", label: "American Samoa" },
  { code: "AT", label: "Austria" },
  {
    code: "AU",
    label: "Australia",
    phone: "61",
    suggested: true,
  },
  { code: "AW", label: "Aruba" },
  { code: "AX", label: "Alland Islands" },
  { code: "AZ", label: "Azerbaijan" },
  {
    code: "BA",
    label: "Bosnia and Herzegovina",
    phone: "387",
  },
  { code: "BB", label: "Barbados" },
  { code: "BD", label: "Bangladesh" },
  { code: "BE", label: "Belgium" },
  { code: "BF", label: "Burkina Faso" },
  { code: "BG", label: "Bulgaria" },
  { code: "BH", label: "Bahrain" },
  { code: "BI", label: "Burundi" },
  { code: "BJ", label: "Benin" },
  { code: "BL", label: "Saint Barthelemy" },
  { code: "BM", label: "Bermuda" },
  { code: "BN", label: "Brunei Darussalam" },
  { code: "BO", label: "Bolivia" },
  { code: "BR", label: "Brazil" },
  { code: "BS", label: "Bahamas" },
  { code: "BT", label: "Bhutan" },
  { code: "BV", label: "Bouvet Island" },
  { code: "BW", label: "Botswana" },
  { code: "BY", label: "Belarus" },
  { code: "BZ", label: "Belize" },
  {
    code: "CA",
    label: "Canada",
    phone: "1",
    suggested: true,
  },
  {
    code: "CC",
    label: "Cocos (Keeling) Islands",
    phone: "61",
  },
  {
    code: "CD",
    label: "Congo, Democratic Republic of the",
    phone: "243",
  },
  {
    code: "CF",
    label: "Central African Republic",
    phone: "236",
  },
  {
    code: "CG",
    label: "Congo, Republic of the",
    phone: "242",
  },
  { code: "CH", label: "Switzerland" },
  { code: "CI", label: "Cote d'Ivoire" },
  { code: "CK", label: "Cook Islands" },
  { code: "CL", label: "Chile" },
  { code: "CM", label: "Cameroon" },
  { code: "CN", label: "China" },
  { code: "CO", label: "Colombia" },
  { code: "CR", label: "Costa Rica" },
  { code: "CU", label: "Cuba" },
  { code: "CV", label: "Cape Verde" },
  { code: "CW", label: "Curacao" },
  { code: "CX", label: "Christmas Island" },
  { code: "CY", label: "Cyprus" },
  { code: "CZ", label: "Czech Republic" },
  {
    code: "DE",
    label: "Germany",
    phone: "49",
    suggested: true,
  },
  { code: "DJ", label: "Djibouti" },
  { code: "DK", label: "Denmark" },
  { code: "DM", label: "Dominica" },
  {
    code: "DO",
    label: "Dominican Republic",
    phone: "1-809",
  },
  { code: "DZ", label: "Algeria" },
  { code: "EC", label: "Ecuador" },
  { code: "EE", label: "Estonia" },
  { code: "EG", label: "Egypt" },
  { code: "EH", label: "Western Sahara" },
  { code: "ER", label: "Eritrea" },
  { code: "ES", label: "Spain" },
  { code: "ET", label: "Ethiopia" },
  { code: "FI", label: "Finland" },
  { code: "FJ", label: "Fiji" },
  {
    code: "FK",
    label: "Falkland Islands (Malvinas)",
    phone: "500",
  },
  {
    code: "FM",
    label: "Micronesia, Federated States of",
    phone: "691",
  },
  { code: "FO", label: "Faroe Islands" },
  {
    code: "FR",
    label: "France",
    phone: "33",
    suggested: true,
  },
  { code: "GA", label: "Gabon" },
  { code: "GB", label: "United Kingdom" },
  { code: "GD", label: "Grenada" },
  { code: "GE", label: "Georgia" },
  { code: "GF", label: "French Guiana" },
  { code: "GG", label: "Guernsey" },
  { code: "GH", label: "Ghana" },
  { code: "GI", label: "Gibraltar" },
  { code: "GL", label: "Greenland" },
  { code: "GM", label: "Gambia" },
  { code: "GN", label: "Guinea" },
  { code: "GP", label: "Guadeloupe" },
  { code: "GQ", label: "Equatorial Guinea" },
  { code: "GR", label: "Greece" },
  {
    code: "GS",
    label: "South Georgia and the South Sandwich Islands",
    phone: "500",
  },
  { code: "GT", label: "Guatemala" },
  { code: "GU", label: "Guam" },
  { code: "GW", label: "Guinea-Bissau" },
  { code: "GY", label: "Guyana" },
  { code: "HK", label: "Hong Kong" },
  {
    code: "HM",
    label: "Heard Island and McDonald Islands",
    phone: "672",
  },
  { code: "HN", label: "Honduras" },
  { code: "HR", label: "Croatia" },
  { code: "HT", label: "Haiti" },
  { code: "HU", label: "Hungary" },
  { code: "ID", label: "Indonesia" },
  { code: "IE", label: "Ireland" },
  { code: "IL", label: "Israel" },
  { code: "IM", label: "Isle of Man" },
  { code: "IN", label: "India" },
  {
    code: "IO",
    label: "British Indian Ocean Territory",
    phone: "246",
  },
  { code: "IQ", label: "Iraq" },
  {
    code: "IR",
    label: "Iran, Islamic Republic of",
    phone: "98",
  },
  { code: "IS", label: "Iceland" },
  { code: "IT", label: "Italy" },
  { code: "JE", label: "Jersey" },
  { code: "JM", label: "Jamaica" },
  { code: "JO", label: "Jordan" },
  {
    code: "JP",
    label: "Japan",
    phone: "81",
    suggested: true,
  },
  { code: "KE", label: "Kenya" },
  { code: "KG", label: "Kyrgyzstan" },
  { code: "KH", label: "Cambodia" },
  { code: "KI", label: "Kiribati" },
  { code: "KM", label: "Comoros" },
  {
    code: "KN",
    label: "Saint Kitts and Nevis",
    phone: "1-869",
  },
  {
    code: "KP",
    label: "Korea, Democratic People's Republic of",
    phone: "850",
  },
  { code: "KR", label: "Korea, Republic of" },
  { code: "KW", label: "Kuwait" },
  { code: "KY", label: "Cayman Islands" },
  { code: "KZ", label: "Kazakhstan" },
  {
    code: "LA",
    label: "Lao People's Democratic Republic",
    phone: "856",
  },
  { code: "LB", label: "Lebanon" },
  { code: "LC", label: "Saint Lucia" },
  { code: "LI", label: "Liechtenstein" },
  { code: "LK", label: "Sri Lanka" },
  { code: "LR", label: "Liberia" },
  { code: "LS", label: "Lesotho" },
  { code: "LT", label: "Lithuania" },
  { code: "LU", label: "Luxembourg" },
  { code: "LV", label: "Latvia" },
  { code: "LY", label: "Libya" },
  { code: "MA", label: "Morocco" },
  { code: "MC", label: "Monaco" },
  {
    code: "MD",
    label: "Moldova, Republic of",
    phone: "373",
  },
  { code: "ME", label: "Montenegro" },
  {
    code: "MF",
    label: "Saint Martin (French part)",
    phone: "590",
  },
  { code: "MG", label: "Madagascar" },
  { code: "MH", label: "Marshall Islands" },
  {
    code: "MK",
    label: "Macedonia, the Former Yugoslav Republic of",
    phone: "389",
  },
  { code: "ML", label: "Mali" },
  { code: "MM", label: "Myanmar" },
  { code: "MN", label: "Mongolia" },
  { code: "MO", label: "Macao" },
  {
    code: "MP",
    label: "Northern Mariana Islands",
    phone: "1-670",
  },
  { code: "MQ", label: "Martinique" },
  { code: "MR", label: "Mauritania" },
  { code: "MS", label: "Montserrat" },
  { code: "MT", label: "Malta" },
  { code: "MU", label: "Mauritius" },
  { code: "MV", label: "Maldives" },
  { code: "MW", label: "Malawi" },
  { code: "MX", label: "Mexico" },
  { code: "MY", label: "Malaysia" },
  { code: "MZ", label: "Mozambique" },
  { code: "NA", label: "Namibia" },
  { code: "NC", label: "New Caledonia" },
  { code: "NE", label: "Niger" },
  { code: "NF", label: "Norfolk Island" },
  { code: "NG", label: "Nigeria" },
  { code: "NI", label: "Nicaragua" },
  { code: "NL", label: "Netherlands" },
  { code: "NO", label: "Norway" },
  { code: "NP", label: "Nepal" },
  { code: "NR", label: "Nauru" },
  { code: "NU", label: "Niue" },
  { code: "NZ", label: "New Zealand" },
  { code: "OM", label: "Oman" },
  { code: "PA", label: "Panama" },
  { code: "PE", label: "Peru" },
  { code: "PF", label: "French Polynesia" },
  { code: "PG", label: "Papua New Guinea" },
  { code: "PH", label: "Philippines" },
  { code: "PK", label: "Pakistan" },
  { code: "PL", label: "Poland" },
  {
    code: "PM",
    label: "Saint Pierre and Miquelon",
    phone: "508",
  },
  { code: "PN", label: "Pitcairn" },
  { code: "PR", label: "Puerto Rico" },
  {
    code: "PS",
    label: "Palestine, State of",
    phone: "970",
  },
  { code: "PT", label: "Portugal" },
  { code: "PW", label: "Palau" },
  { code: "PY", label: "Paraguay" },
  { code: "QA", label: "Qatar" },
  { code: "RE", label: "Reunion" },
  { code: "RO", label: "Romania" },
  { code: "RS", label: "Serbia" },
  { code: "RU", label: "Russian Federation" },
  { code: "RW", label: "Rwanda" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "SB", label: "Solomon Islands" },
  { code: "SC", label: "Seychelles" },
  { code: "SD", label: "Sudan" },
  { code: "SE", label: "Sweden" },
  { code: "SG", label: "Singapore" },
  { code: "SH", label: "Saint Helena" },
  { code: "SI", label: "Slovenia" },
  {
    code: "SJ",
    label: "Svalbard and Jan Mayen",
    phone: "47",
  },
  { code: "SK", label: "Slovakia" },
  { code: "SL", label: "Sierra Leone" },
  { code: "SM", label: "San Marino" },
  { code: "SN", label: "Senegal" },
  { code: "SO", label: "Somalia" },
  { code: "SR", label: "Suriname" },
  { code: "SS", label: "South Sudan" },
  {
    code: "ST",
    label: "Sao Tome and Principe",
    phone: "239",
  },
  { code: "SV", label: "El Salvador" },
  {
    code: "SX",
    label: "Sint Maarten (Dutch part)",
    phone: "1-721",
  },
  {
    code: "SY",
    label: "Syrian Arab Republic",
    phone: "963",
  },
  { code: "SZ", label: "Swaziland" },
  {
    code: "TC",
    label: "Turks and Caicos Islands",
    phone: "1-649",
  },
  { code: "TD", label: "Chad" },
  {
    code: "TF",
    label: "French Southern Territories",
    phone: "262",
  },
  { code: "TG", label: "Togo" },
  { code: "TH", label: "Thailand" },
  { code: "TJ", label: "Tajikistan" },
  { code: "TK", label: "Tokelau" },
  { code: "TL", label: "Timor-Leste" },
  { code: "TM", label: "Turkmenistan" },
  { code: "TN", label: "Tunisia" },
  { code: "TO", label: "Tonga" },
  { code: "TR", label: "Turkey" },
  {
    code: "TT",
    label: "Trinidad and Tobago",
    phone: "1-868",
  },
  { code: "TV", label: "Tuvalu" },
  {
    code: "TW",
    label: "Taiwan",
    phone: "886",
  },
  {
    code: "TZ",
    label: "United Republic of Tanzania",
    phone: "255",
  },
  { code: "UA", label: "Ukraine" },
  { code: "UG", label: "Uganda" },
  {
    code: "US",
    label: "United States",
    phone: "1",
    suggested: true,
  },
  { code: "UY", label: "Uruguay" },
  { code: "UZ", label: "Uzbekistan" },
  {
    code: "VA",
    label: "Holy See (Vatican City State)",
    phone: "379",
  },
  {
    code: "VC",
    label: "Saint Vincent and the Grenadines",
    phone: "1-784",
  },
  { code: "VE", label: "Venezuela" },
  {
    code: "VG",
    label: "British Virgin Islands",
    phone: "1-284",
  },
  {
    code: "VI",
    label: "US Virgin Islands",
    phone: "1-340",
  },
  { code: "VN", label: "Vietnam" },
  { code: "VU", label: "Vanuatu" },
  { code: "WF", label: "Wallis and Futuna" },
  { code: "WS", label: "Samoa" },
  { code: "XK", label: "Kosovo" },
  { code: "YE", label: "Yemen" },
  { code: "YT", label: "Mayotte" },
  { code: "ZA", label: "South Africa" },
  { code: "ZM", label: "Zambia" },
  { code: "ZW", label: "Zimbabwe" },
];
