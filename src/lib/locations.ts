export interface LocationDivision {
  name: string;
  districts: string[];
}

export const BANGLADESH_DIVISIONS: LocationDivision[] = [
  {
    name: 'Dhaka',
    districts: [
      'Dhaka',
      'Gazipur',
      'Narayanganj',
      'Tangail',
      'Faridpur',
      'Manikganj',
      'Munshiganj',
      'Narsingdi',
      'Gopalganj',
      'Madaripur',
      'Rajbari',
      'Shariatpur',
      'Kishoreganj',
    ],
  },
  {
    name: 'Chittagong',
    districts: [
      'Chittagong',
      "Cox's Bazar",
      'Comilla',
      'Feni',
      'Brahmanbaria',
      'Noakhali',
      'Chandpur',
      'Lakshmipur',
      'Khagrachhari',
      'Rangamati',
      'Bandarban',
    ],
  },
  {
    name: 'Rajshahi',
    districts: [
      'Rajshahi',
      'Bogra',
      'Pabna',
      'Sirajganj',
      'Naogaon',
      'Natore',
      'Chapai Nawabganj',
      'Joypurhat',
    ],
  },
  {
    name: 'Khulna',
    districts: [
      'Khulna',
      'Jessore',
      'Kushtia',
      'Jhenaidah',
      'Bagerhat',
      'Satkhira',
      'Chuadanga',
      'Magura',
      'Meherpur',
      'Narail',
    ],
  },
  {
    name: 'Sylhet',
    districts: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  },
  {
    name: 'Barisal',
    districts: [
      'Barisal',
      'Patuakhali',
      'Bhola',
      'Pirojpur',
      'Barguna',
      'Jhalokati',
    ],
  },
  {
    name: 'Rangpur',
    districts: [
      'Rangpur',
      'Dinajpur',
      'Kurigram',
      'Gaibandha',
      'Nilphamari',
      'Lalmonirhat',
      'Thakurgaon',
      'Panchagarh',
    ],
  },
  {
    name: 'Mymensingh',
    districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
  },
];

export const getDistrictsForDivision = (divisionName: string): string[] => {
  const division = BANGLADESH_DIVISIONS.find(
    (d) => d.name.toLowerCase() === divisionName.toLowerCase()
  );
  return division ? division.districts : [];
};
