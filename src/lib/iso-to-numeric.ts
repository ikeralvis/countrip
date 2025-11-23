// lib/iso-to-numeric.ts
// Mapping from ISO 3166-1 alpha-3 codes to UN M49 numeric codes used by world-atlas
export const ISO_TO_NUMERIC: Record<string, string> = {
    'ESP': '724', // Spain
    'FRA': '250', // France
    'ITA': '380', // Italy
    'DEU': '276', // Germany
    'GBR': '826', // United Kingdom
    'PRT': '620', // Portugal
    'NLD': '528', // Netherlands
    'BEL': '056', // Belgium
    'CHE': '756', // Switzerland
    'AUT': '040', // Austria
    'GRC': '300', // Greece
    'POL': '616', // Poland
    'CZE': '203', // Czech Republic
    'HUN': '348', // Hungary
    'ROU': '642', // Romania
    'BGR': '100', // Bulgaria
    'HRV': '191', // Croatia
    'SRB': '688', // Serbia
    'SVN': '705', // Slovenia
    'SVK': '703', // Slovakia
    'DNK': '208', // Denmark
    'SWE': '752', // Sweden
    'NOR': '578', // Norway
    'FIN': '246', // Finland
    'ISL': '352', // Iceland
    'IRL': '372', // Ireland
    'EST': '233', // Estonia
    'LVA': '428', // Latvia
    'LTU': '440', // Lithuania
    'UKR': '804', // Ukraine
    'BLR': '112', // Belarus
    'RUS': '643', // Russia
    'TUR': '792', // Turkey
    'USA': '840', // United States
    'CAN': '124', // Canada
    'MEX': '484', // Mexico
    'BRA': '076', // Brazil
    'ARG': '032', // Argentina
    'CHL': '152', // Chile
    'COL': '170', // Colombia
    'PER': '604', // Peru
    'VEN': '862', // Venezuela
    'ECU': '218', // Ecuador
    'BOL': '068', // Bolivia
    'PRY': '600', // Paraguay
    'URY': '858', // Uruguay
    'CHN': '156', // China
    'JPN': '392', // Japan
    'KOR': '410', // South Korea
    'IND': '356', // India
    'THA': '764', // Thailand
    'VNM': '704', // Vietnam
    'IDN': '360', // Indonesia
    'MYS': '458', // Malaysia
    'SGP': '702', // Singapore
    'PHL': '608', // Philippines
    'AUS': '036', // Australia
    'NZL': '554', // New Zealand
    'ZAF': '710', // South Africa
    'EGY': '818', // Egypt
    'MAR': '504', // Morocco
    'DZA': '012', // Algeria
    'TUN': '788', // Tunisia
    'KEN': '404', // Kenya
    'NGA': '566', // Nigeria
    'GHA': '288', // Ghana
    'ETH': '231', // Ethiopia
    'TZA': '834', // Tanzania
    'UGA': '800', // Uganda
    'ARE': '784', // UAE
    'SAU': '682', // Saudi Arabia
    'ISR': '376', // Israel
    'JOR': '400', // Jordan
    'LBN': '422', // Lebanon
    'IRN': '364', // Iran
    'IRQ': '368', // Iraq
    'KWT': '414', // Kuwait
    'QAT': '634', // Qatar
    'OMN': '512', // Oman
    'BHR': '048', // Bahrain
    'YEM': '887', // Yemen
    'SYR': '760', // Syria
    'AFG': '004', // Afghanistan
    'PAK': '586', // Pakistan
    'BGD': '050', // Bangladesh
    'LKA': '144', // Sri Lanka
    'NPL': '524', // Nepal
    'MMR': '104', // Myanmar
    'KHM': '116', // Cambodia
    'LAO': '418', // Laos
    'MNG': '496', // Mongolia
    'KAZ': '398', // Kazakhstan
    'UZB': '860', // Uzbekistan
    'TKM': '795', // Turkmenistan
    'KGZ': '417', // Kyrgyzstan
    'TJK': '762', // Tajikistan
    'GEO': '268', // Georgia
    'ARM': '051', // Armenia
    'AZE': '031', // Azerbaijan
    'CUB': '192', // Cuba
    'DOM': '214', // Dominican Republic
    'HTI': '332', // Haiti
    'JAM': '388', // Jamaica
    'TTO': '780', // Trinidad and Tobago
    'CRI': '188', // Costa Rica
    'PAN': '591', // Panama
    'GTM': '320', // Guatemala
    'HND': '340', // Honduras
    'SLV': '222', // El Salvador
    'NIC': '558', // Nicaragua
    'BLZ': '084', // Belize
    'FJI': '242', // Fiji
    'PNG': '598', // Papua New Guinea
    'SLB': '090', // Solomon Islands
    'VUT': '548', // Vanuatu
    'WSM': '882', // Samoa
    'TON': '776', // Tonga
    'KIR': '296', // Kiribati
    'TUV': '798', // Tuvalu
    'NRU': '520', // Nauru
    'PLW': '585', // Palau
    'MHL': '584', // Marshall Islands
    'FSM': '583', // Micronesia
    'ALB': '008', // Albania
    'AND': '020', // Andorra
    'BIH': '070', // Bosnia and Herzegovina
    'CYP': '196', // Cyprus
    'LIE': '438', // Liechtenstein
    'LUX': '442', // Luxembourg
    'MKD': '807', // North Macedonia
    'MLT': '470', // Malta
    'MDA': '498', // Moldova
    'MCO': '492', // Monaco
    'MNE': '499', // Montenegro
    'SMR': '674', // San Marino
    'VAT': '336', // Vatican City
    'XKX': '-99', // Kosovo (no official code)
    'AGO': '024', // Angola
    'BEN': '204', // Benin
    'BWA': '072', // Botswana
    'BFA': '854', // Burkina Faso
    'BDI': '108', // Burundi
    'CMR': '120', // Cameroon
    'CPV': '132', // Cape Verde
    'CAF': '140', // Central African Republic
    'TCD': '148', // Chad
    'COM': '174', // Comoros
    'COG': '178', // Congo
    'COD': '180', // DR Congo
    'CIV': '384', // Ivory Coast
    'DJI': '262', // Djibouti
    'GNQ': '226', // Equatorial Guinea
    'ERI': '232', // Eritrea
    'GAB': '266', // Gabon
    'GMB': '270', // Gambia
    'GIN': '324', // Guinea
    'GNB': '624', // Guinea-Bissau
    'LSO': '426', // Lesotho
    'LBR': '430', // Liberia
    'LBY': '434', // Libya
    'MDG': '450', // Madagascar
    'MWI': '454', // Malawi
    'MLI': '466', // Mali
    'MRT': '478', // Mauritania
    'MUS': '480', // Mauritius
    'MOZ': '508', // Mozambique
    'NAM': '516', // Namibia
    'NER': '562', // Niger
    'RWA': '646', // Rwanda
    'STP': '678', // Sao Tome and Principe
    'SEN': '686', // Senegal
    'SYC': '690', // Seychelles
    'SLE': '694', // Sierra Leone
    'SOM': '706', // Somalia
    'SSD': '728', // South Sudan
    'SDN': '729', // Sudan
    'SWZ': '748', // Eswatini
    'TGO': '768', // Togo
    'ZMB': '894', // Zambia
    'ZWE': '716', // Zimbabwe
    'ATG': '028', // Antigua and Barbuda
    'BHS': '044', // Bahamas
    'BRB': '052', // Barbados
    'DMA': '212', // Dominica
    'GRD': '308', // Grenada
    'KNA': '659', // Saint Kitts and Nevis
    'LCA': '662', // Saint Lucia
    'VCT': '670', // Saint Vincent and the Grenadines
    'GUY': '328', // Guyana
    'SUR': '740', // Suriname
    'BTN': '064', // Bhutan
    'BRN': '096', // Brunei
    'TLS': '626', // Timor-Leste
    'TWN': '158', // Taiwan
    'PRK': '408', // North Korea
    'PSE': '275', // Palestine
}
