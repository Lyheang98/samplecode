// Import ALL of your JSON files here.
import banteayMeanCheyData from './BanteayMeanChey.json';
import battambangData from './Battambang.json';
import kampongChamData from './KampongCham.json';
import kampongChhnangData from './KampongChhnang.json';
import kampongSpeuData from './KampongSpeu.json';
import kampongThomData from './KampongThom.json';
import kampotData from './Kampot.json';
import kandalData from './Kandal.json';
import kepData from './Kep.json';
import kohKongData from './KohKong.json';
import kratieData from './Kratie.json';
import mondulKiriData from './MondulKiri.json';
import oddarMeanCheyData from './OddarMeanChey.json';
import pailinData from './Pailin.json';
import phnomPenhData from './PhnomPenh.json';
import preahSihanoukData from './PreahSihanouk.json';
import preahVihearData from './PreahVihear.json';
import preyVengData from './PreyVeng.json';
import pursatData from './Pursat.json';
import ratanakiriData from './Ratanakiri.json';
import siemReapData from './SiemReap.json';
import stungTrengData from './StungTreng.json';
import svayRiengData from './SvayRieng.json';
import takeoData from './Takeo.json';
import tboungKhmumData from './TboungKhmum.json';


// Combine all student data into a single array
const allStudents: Student[] = [
  ...banteayMeanCheyData,
  ...battambangData,
  ...kampongChamData,
  ...kampongChhnangData,
  ...kampongSpeuData,
  ...kampongThomData,
  ...kampotData,
  ...kandalData,
  ...kepData,
  ...kohKongData,
  ...kratieData,
  ...mondulKiriData,
  ...oddarMeanCheyData,
  ...pailinData,
  ...phnomPenhData,
  ...preahSihanoukData,
  ...preahVihearData,
  ...preyVengData,
  ...pursatData,
  ...ratanakiriData,
  ...siemReapData,
  ...stungTrengData,
  ...svayRiengData,
  ...takeoData,
  ...tboungKhmumData,
];

// Export the combined array as the default export
export default allStudents;