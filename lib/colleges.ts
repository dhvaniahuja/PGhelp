export type College = {
  slug: string
  name: string
  shortName: string
  area: string
  location: string
  image: string
  imageAlt: string
  imageCredit: string
  imageLicense: string
  imageSource: string
}

export const colleges: College[] = [
  {
    slug: 'bms-college-of-engineering',
    name: 'BMS College of Engineering',
    shortName: 'BMSCE',
    area: 'Basavanagudi',
    location: 'Bull Temple Road, Basavanagudi, Bengaluru 560019',
    image: '/images/campus/bmsce.jpg',
    imageAlt: 'Entrance sign of BMS College of Engineering in Kannada and English',
    imageCredit: 'Sujaybagi',
    imageLicense: 'Public domain',
    imageSource: 'https://commons.wikimedia.org/wiki/File:BMSCE_Entrance_Golden_letters.jpg',
  },
  {
    slug: 'rv-college-of-engineering',
    name: 'RV College of Engineering',
    shortName: 'RVCE',
    area: 'Mysuru Road',
    location: 'Mysuru Road, RV Vidyaniketan Post, Bengaluru 560059',
    image: '/images/campus/rvce.jpg',
    imageAlt: 'Administrative block of RV College of Engineering',
    imageCredit: 'Rvian00',
    imageLicense: 'CC BY-SA 3.0',
    imageSource: 'https://commons.wikimedia.org/wiki/File:RV_College_Admin_block.JPG',
  },
  {
    slug: 'ramaiah-institute-of-technology',
    name: 'Ramaiah Institute of Technology',
    shortName: 'RIT',
    area: 'Mathikere',
    location: 'MSR Nagar, Mathikere, Bengaluru 560054',
    image: '/images/campus/msrit.jpg',
    imageAlt: 'Apex Block of Ramaiah Institute of Technology',
    imageCredit: 'Sunithbabu78',
    imageLicense: 'CC BY-SA 3.0',
    imageSource:
      'https://commons.wikimedia.org/wiki/File:M_S_Ramaiah_Institute_of_Technology_Apex_Block.jpg',
  },
  {
    slug: 'pes-university',
    name: 'PES University',
    shortName: 'PESU',
    area: 'Banashankari',
    location: '100 Feet Ring Road, Banashankari Stage III, Bengaluru 560085',
    image: '/images/campus/pes.jpg',
    imageAlt: 'Academic block on the PES University Ring Road campus',
    imageCredit: 'Intull',
    imageLicense: 'CC BY-SA 3.0',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Pesit_e-block2.jpg',
  },
  {
    slug: 'bangalore-institute-of-technology',
    name: 'Bangalore Institute of Technology',
    shortName: 'BIT',
    area: 'V.V. Puram',
    location: 'K.R. Road, V.V. Puram, Bengaluru 560004',
    image: '/images/campus/bit.jpg',
    imageAlt: 'Main building of Bangalore Institute of Technology',
    imageCredit: 'Shreeprasadbhat',
    imageLicense: 'CC BY-SA 4.0',
    imageSource:
      'https://commons.wikimedia.org/wiki/File:Bangalore_Institute_of_Technology,_Bangalore,_Karnataka,_India_(2016).jpg',
  },
  {
    slug: 'dayananda-sagar-college-of-engineering',
    name: 'Dayananda Sagar College of Engineering',
    shortName: 'DSCE',
    area: 'Kumaraswamy Layout',
    location: 'Shavige Malleshwara Hills, Kumaraswamy Layout, Bengaluru 560111',
    image: '/images/campus/dsce.jpg',
    imageAlt: 'Campus building of Dayananda Sagar College of Engineering',
    imageCredit: 'DSUManu',
    imageLicense: 'CC BY-SA 4.0',
    imageSource:
      'https://commons.wikimedia.org/wiki/File:Dayananda_Sagar_College_of_Engineering,_Bangalore,_Karnataka,_India_(2018).jpg',
  },
  {
    slug: 'christ-university',
    name: 'Christ University',
    shortName: 'Christ',
    area: 'Hosur Road',
    location: 'Hosur Road, Bengaluru 560029',
    image: '/images/campus/christ.jpg',
    imageAlt: 'Christ University central campus on Hosur Road',
    imageCredit: 'Rameshng',
    imageLicense: 'CC BY-SA 3.0',
    imageSource:
      'https://commons.wikimedia.org/wiki/File:Christ_University_Hosur_road_Bangalore_4819.JPG',
  },
  {
    slug: 'jain-university',
    name: 'Jain University',
    shortName: 'Jain',
    area: 'Jayanagar',
    location: 'Jayanagar, Bengaluru · multiple campuses across the city',
    image: '/images/campus/jain.jpg',
    imageAlt: 'Jain University campus building lit at dusk',
    imageCredit: 'Sainath nuvvula',
    imageLicense: 'CC BY-SA 4.0',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Jain-University-Bangalore.jpg',
  },
]

export function getCollege(slug: string) {
  return colleges.find((college) => college.slug === slug)
}
