export interface Country {
  /** Código ISO 3166-1 alpha-2. */
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  /** Cantidad de dígitos del número nacional, sin el prefijo. */
  minLength: number;
  maxLength: number;
  placeholder: string;
}

type RawCountry = Omit<Country, "flag">;

/** Emoji de bandera a partir del código ISO (2 símbolos "regional indicator"). */
const flagFromCode = (code: string): string =>
  code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

/**
 * Placeholder genérico agrupado de a 3 dígitos, para los países que no tienen
 * un formato local curado a mano abajo.
 */
const genericPlaceholder = (length: number): string =>
  "123456789012345"
    .slice(0, length)
    .replace(/(\d{3})(?=\d)/g, "$1 ");

/**
 * Para la mayoría de países latinoamericanos y los mercados más grandes se
 * usó el largo real del número móvil. Para el resto del mundo —donde no hay
 * una fuente verificada a mano— el mínimo se relaja a propósito con esta
 * constante: es mejor aceptar de más que rechazar un número real de un lead.
 */
const GENERIC_MIN = 6;

const RAW_COUNTRIES: RawCountry[] = [
  // --- Latinoamérica y el Caribe ---
  { code: "CO", name: "Colombia", dialCode: "+57", minLength: 10, maxLength: 10, placeholder: "300 123 4567" },
  { code: "MX", name: "México", dialCode: "+52", minLength: 10, maxLength: 10, placeholder: "55 1234 5678" },
  { code: "VE", name: "Venezuela", dialCode: "+58", minLength: 10, maxLength: 10, placeholder: "412 123 4567" },
  { code: "AR", name: "Argentina", dialCode: "+54", minLength: 10, maxLength: 11, placeholder: "9 11 1234 5678" },
  { code: "CL", name: "Chile", dialCode: "+56", minLength: 9, maxLength: 9, placeholder: "9 1234 5678" },
  { code: "PE", name: "Perú", dialCode: "+51", minLength: 9, maxLength: 9, placeholder: "912 345 678" },
  { code: "EC", name: "Ecuador", dialCode: "+593", minLength: 9, maxLength: 9, placeholder: "99 123 4567" },
  { code: "PA", name: "Panamá", dialCode: "+507", minLength: 8, maxLength: 8, placeholder: "6123 4567" },
  { code: "CR", name: "Costa Rica", dialCode: "+506", minLength: 8, maxLength: 8, placeholder: "8312 3456" },
  { code: "DO", name: "República Dominicana", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: "809 123 4567" },
  { code: "GT", name: "Guatemala", dialCode: "+502", minLength: 8, maxLength: 8, placeholder: "5123 4567" },
  { code: "SV", name: "El Salvador", dialCode: "+503", minLength: 8, maxLength: 8, placeholder: "7123 4567" },
  { code: "HN", name: "Honduras", dialCode: "+504", minLength: 8, maxLength: 8, placeholder: "9123 4567" },
  { code: "NI", name: "Nicaragua", dialCode: "+505", minLength: 8, maxLength: 8, placeholder: "8123 4567" },
  { code: "BO", name: "Bolivia", dialCode: "+591", minLength: 8, maxLength: 8, placeholder: "7123 4567" },
  { code: "PY", name: "Paraguay", dialCode: "+595", minLength: 9, maxLength: 9, placeholder: "981 234 567" },
  { code: "UY", name: "Uruguay", dialCode: "+598", minLength: 8, maxLength: 8, placeholder: "9123 4567" },
  { code: "BR", name: "Brasil", dialCode: "+55", minLength: 10, maxLength: 11, placeholder: "11 91234 5678" },
  { code: "PR", name: "Puerto Rico", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: "787 123 4567" },
  { code: "CU", name: "Cuba", dialCode: "+53", minLength: 8, maxLength: 8, placeholder: "5123 4567" },
  { code: "BZ", name: "Belice", dialCode: "+501", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "GY", name: "Guyana", dialCode: "+592", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "SR", name: "Surinam", dialCode: "+597", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "HT", name: "Haití", dialCode: "+509", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "JM", name: "Jamaica", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "TT", name: "Trinidad y Tobago", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "BS", name: "Bahamas", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "BB", name: "Barbados", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "AG", name: "Antigua y Barbuda", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "LC", name: "Santa Lucía", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "GD", name: "Granada", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "VC", name: "San Vicente y las Granadinas", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "DM", name: "Dominica", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "KN", name: "San Cristóbal y Nieves", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },

  // --- Norteamérica ---
  { code: "US", name: "Estados Unidos", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: "305 123 4567" },
  { code: "CA", name: "Canadá", dialCode: "+1", minLength: 10, maxLength: 10, placeholder: "416 123 4567" },

  // --- Europa ---
  { code: "ES", name: "España", dialCode: "+34", minLength: 9, maxLength: 9, placeholder: "612 345 678" },
  { code: "IT", name: "Italia", dialCode: "+39", minLength: 9, maxLength: 10, placeholder: "312 345 6789" },
  { code: "PT", name: "Portugal", dialCode: "+351", minLength: 9, maxLength: 9, placeholder: "912 345 678" },
  { code: "FR", name: "Francia", dialCode: "+33", minLength: 9, maxLength: 9, placeholder: "612 345 678" },
  { code: "DE", name: "Alemania", dialCode: "+49", minLength: 10, maxLength: 11, placeholder: "1512 3456789" },
  { code: "GB", name: "Reino Unido", dialCode: "+44", minLength: 10, maxLength: 10, placeholder: "7400 123456" },
  { code: "NL", name: "Países Bajos", dialCode: "+31", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "BE", name: "Bélgica", dialCode: "+32", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "CH", name: "Suiza", dialCode: "+41", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "AT", name: "Austria", dialCode: "+43", minLength: 10, maxLength: 11, placeholder: genericPlaceholder(10) },
  { code: "SE", name: "Suecia", dialCode: "+46", minLength: 7, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "NO", name: "Noruega", dialCode: "+47", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "DK", name: "Dinamarca", dialCode: "+45", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "FI", name: "Finlandia", dialCode: "+358", minLength: 9, maxLength: 10, placeholder: genericPlaceholder(9) },
  { code: "IE", name: "Irlanda", dialCode: "+353", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "PL", name: "Polonia", dialCode: "+48", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "GR", name: "Grecia", dialCode: "+30", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "RO", name: "Rumania", dialCode: "+40", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "BG", name: "Bulgaria", dialCode: "+359", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "HR", name: "Croacia", dialCode: "+385", minLength: 8, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "RS", name: "Serbia", dialCode: "+381", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "SI", name: "Eslovenia", dialCode: "+386", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "SK", name: "Eslovaquia", dialCode: "+421", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "CZ", name: "República Checa", dialCode: "+420", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "HU", name: "Hungría", dialCode: "+36", minLength: 8, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "UA", name: "Ucrania", dialCode: "+380", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "BY", name: "Bielorrusia", dialCode: "+375", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MD", name: "Moldavia", dialCode: "+373", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "LT", name: "Lituania", dialCode: "+370", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "LV", name: "Letonia", dialCode: "+371", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "EE", name: "Estonia", dialCode: "+372", minLength: 7, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "IS", name: "Islandia", dialCode: "+354", minLength: 7, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "LU", name: "Luxemburgo", dialCode: "+352", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MT", name: "Malta", dialCode: "+356", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "CY", name: "Chipre", dialCode: "+357", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "AL", name: "Albania", dialCode: "+355", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MK", name: "Macedonia del Norte", dialCode: "+389", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "ME", name: "Montenegro", dialCode: "+382", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "BA", name: "Bosnia y Herzegovina", dialCode: "+387", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "XK", name: "Kosovo", dialCode: "+383", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "AD", name: "Andorra", dialCode: "+376", minLength: 6, maxLength: 6, placeholder: genericPlaceholder(6) },
  { code: "MC", name: "Mónaco", dialCode: "+377", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(8) },
  { code: "SM", name: "San Marino", dialCode: "+378", minLength: GENERIC_MIN, maxLength: 10, placeholder: genericPlaceholder(8) },
  { code: "VA", name: "Ciudad del Vaticano", dialCode: "+379", minLength: GENERIC_MIN, maxLength: 10, placeholder: genericPlaceholder(8) },
  { code: "LI", name: "Liechtenstein", dialCode: "+423", minLength: 7, maxLength: 9, placeholder: genericPlaceholder(7) },
  { code: "RU", name: "Rusia", dialCode: "+7", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },

  // --- Asia ---
  { code: "CN", name: "China", dialCode: "+86", minLength: 11, maxLength: 11, placeholder: genericPlaceholder(11) },
  { code: "JP", name: "Japón", dialCode: "+81", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "KR", name: "Corea del Sur", dialCode: "+82", minLength: 9, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "KP", name: "Corea del Norte", dialCode: "+850", minLength: GENERIC_MIN, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "IN", name: "India", dialCode: "+91", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "PK", name: "Pakistán", dialCode: "+92", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "BD", name: "Bangladés", dialCode: "+880", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "LK", name: "Sri Lanka", dialCode: "+94", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "NP", name: "Nepal", dialCode: "+977", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "BT", name: "Bután", dialCode: "+975", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "MV", name: "Maldivas", dialCode: "+960", minLength: 7, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "AF", name: "Afganistán", dialCode: "+93", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "IR", name: "Irán", dialCode: "+98", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "IQ", name: "Irak", dialCode: "+964", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "IL", name: "Israel", dialCode: "+972", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "PS", name: "Palestina", dialCode: "+970", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "JO", name: "Jordania", dialCode: "+962", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "LB", name: "Líbano", dialCode: "+961", minLength: 7, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "SY", name: "Siria", dialCode: "+963", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "SA", name: "Arabia Saudita", dialCode: "+966", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "YE", name: "Yemen", dialCode: "+967", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "OM", name: "Omán", dialCode: "+968", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "AE", name: "Emiratos Árabes Unidos", dialCode: "+971", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "QA", name: "Catar", dialCode: "+974", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "BH", name: "Baréin", dialCode: "+973", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "KW", name: "Kuwait", dialCode: "+965", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "TR", name: "Turquía", dialCode: "+90", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "GE", name: "Georgia", dialCode: "+995", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "AM", name: "Armenia", dialCode: "+374", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "AZ", name: "Azerbaiyán", dialCode: "+994", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "KZ", name: "Kazajistán", dialCode: "+7", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "UZ", name: "Uzbekistán", dialCode: "+998", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "TM", name: "Turkmenistán", dialCode: "+993", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "KG", name: "Kirguistán", dialCode: "+996", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "TJ", name: "Tayikistán", dialCode: "+992", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MN", name: "Mongolia", dialCode: "+976", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "VN", name: "Vietnam", dialCode: "+84", minLength: 9, maxLength: 10, placeholder: genericPlaceholder(9) },
  { code: "LA", name: "Laos", dialCode: "+856", minLength: GENERIC_MIN, maxLength: 10, placeholder: genericPlaceholder(9) },
  { code: "KH", name: "Camboya", dialCode: "+855", minLength: 8, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "TH", name: "Tailandia", dialCode: "+66", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MM", name: "Myanmar", dialCode: "+95", minLength: 8, maxLength: 10, placeholder: genericPlaceholder(9) },
  { code: "MY", name: "Malasia", dialCode: "+60", minLength: 9, maxLength: 10, placeholder: genericPlaceholder(9) },
  { code: "SG", name: "Singapur", dialCode: "+65", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "ID", name: "Indonesia", dialCode: "+62", minLength: 9, maxLength: 12, placeholder: genericPlaceholder(10) },
  { code: "PH", name: "Filipinas", dialCode: "+63", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "BN", name: "Brunéi", dialCode: "+673", minLength: 7, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "TW", name: "Taiwán", dialCode: "+886", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "HK", name: "Hong Kong", dialCode: "+852", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "MO", name: "Macao", dialCode: "+853", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },

  // --- África ---
  { code: "NG", name: "Nigeria", dialCode: "+234", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "EG", name: "Egipto", dialCode: "+20", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "ZA", name: "Sudáfrica", dialCode: "+27", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "KE", name: "Kenia", dialCode: "+254", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "GH", name: "Ghana", dialCode: "+233", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MA", name: "Marruecos", dialCode: "+212", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "DZ", name: "Argelia", dialCode: "+213", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "TN", name: "Túnez", dialCode: "+216", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "LY", name: "Libia", dialCode: "+218", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "SD", name: "Sudán", dialCode: "+249", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "SS", name: "Sudán del Sur", dialCode: "+211", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "ET", name: "Etiopía", dialCode: "+251", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "ER", name: "Eritrea", dialCode: "+291", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "DJ", name: "Yibuti", dialCode: "+253", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "SO", name: "Somalia", dialCode: "+252", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(8) },
  { code: "UG", name: "Uganda", dialCode: "+256", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "TZ", name: "Tanzania", dialCode: "+255", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "RW", name: "Ruanda", dialCode: "+250", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "BI", name: "Burundi", dialCode: "+257", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "CD", name: "República Democrática del Congo", dialCode: "+243", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "CG", name: "República del Congo", dialCode: "+242", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "GA", name: "Gabón", dialCode: "+241", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "CM", name: "Camerún", dialCode: "+237", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "CF", name: "República Centroafricana", dialCode: "+236", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "TD", name: "Chad", dialCode: "+235", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "NE", name: "Níger", dialCode: "+227", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "ML", name: "Malí", dialCode: "+223", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "SN", name: "Senegal", dialCode: "+221", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MR", name: "Mauritania", dialCode: "+222", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "GM", name: "Gambia", dialCode: "+220", minLength: 7, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "GW", name: "Guinea-Bisáu", dialCode: "+245", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "GN", name: "Guinea", dialCode: "+224", minLength: 8, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "SL", name: "Sierra Leona", dialCode: "+232", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "LR", name: "Liberia", dialCode: "+231", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(8) },
  { code: "CI", name: "Costa de Marfil", dialCode: "+225", minLength: 10, maxLength: 10, placeholder: genericPlaceholder(10) },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "TG", name: "Togo", dialCode: "+228", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "BJ", name: "Benín", dialCode: "+229", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "GQ", name: "Guinea Ecuatorial", dialCode: "+240", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "ST", name: "Santo Tomé y Príncipe", dialCode: "+239", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "CV", name: "Cabo Verde", dialCode: "+238", minLength: 7, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "AO", name: "Angola", dialCode: "+244", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "ZM", name: "Zambia", dialCode: "+260", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MW", name: "Malaui", dialCode: "+265", minLength: GENERIC_MIN, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MZ", name: "Mozambique", dialCode: "+258", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "ZW", name: "Zimbabue", dialCode: "+263", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "BW", name: "Botsuana", dialCode: "+267", minLength: 7, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "NA", name: "Namibia", dialCode: "+264", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "SZ", name: "Esuatini", dialCode: "+268", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "LS", name: "Lesoto", dialCode: "+266", minLength: 8, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "MG", name: "Madagascar", dialCode: "+261", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "MU", name: "Mauricio", dialCode: "+230", minLength: 7, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "SC", name: "Seychelles", dialCode: "+248", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "KM", name: "Comoras", dialCode: "+269", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },

  // --- Oceanía ---
  { code: "AU", name: "Australia", dialCode: "+61", minLength: 9, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "NZ", name: "Nueva Zelanda", dialCode: "+64", minLength: 8, maxLength: 9, placeholder: genericPlaceholder(9) },
  { code: "FJ", name: "Fiyi", dialCode: "+679", minLength: 7, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "PG", name: "Papúa Nueva Guinea", dialCode: "+675", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "WS", name: "Samoa", dialCode: "+685", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "TO", name: "Tonga", dialCode: "+676", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "VU", name: "Vanuatu", dialCode: "+678", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "SB", name: "Islas Salomón", dialCode: "+677", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "KI", name: "Kiribati", dialCode: "+686", minLength: GENERIC_MIN, maxLength: 8, placeholder: genericPlaceholder(8) },
  { code: "FM", name: "Micronesia", dialCode: "+691", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "MH", name: "Islas Marshall", dialCode: "+692", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "PW", name: "Palaos", dialCode: "+680", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "NR", name: "Nauru", dialCode: "+674", minLength: GENERIC_MIN, maxLength: 7, placeholder: genericPlaceholder(7) },
  { code: "TV", name: "Tuvalu", dialCode: "+688", minLength: GENERIC_MIN, maxLength: 6, placeholder: genericPlaceholder(6) },
];

export const COUNTRIES: Country[] = RAW_COUNTRIES.map((country) => ({
  ...country,
  flag: flagFromCode(country.code),
}));

/**
 * La audiencia principal está en Colombia, así que el selector abre
 * en +57. El resto de países sigue disponible en el mismo selector para los
 * traders del exterior que también llegan por la pauta.
 */
export const DEFAULT_COUNTRY_CODE = "CO";

export const findCountry = (code: string): Country =>
  COUNTRIES.find((country) => country.code === code) ??
  COUNTRIES.find((country) => country.code === DEFAULT_COUNTRY_CODE)!;
