import {throwException} from '../core/Util';
import createUnknownElement from './EBMLElement/Unknown';

const clazz = {
  'File': require('./EBMLElement/File').default,
  // Level-0 element - EBML
  'EBML': require('./EBMLElement/EBML').default,
  'EBMLVersion': require('./EBMLElement/EBMLVersion').default,
  'EBMLReadVersion': require('./EBMLElement/EBMLReadVersion').default,
  'EBMLMaxIDLength': require('./EBMLElement/EBMLMaxIDLength').default,
  'EBMLMaxSizeLength': require('./EBMLElement/EBMLMaxSizeLength').default,
  'DocType': require('./EBMLElement/DocType').default,
  'DocTypeVersion': require('./EBMLElement/DocTypeVersion').default,
  'DocTypeReadVersion': require('./EBMLElement/DocTypeReadVersion').default,
  // Global element - Void
  'Void': require('./EBMLElement/Void').default,
  // Level-0 element - Segment
  'Segment': require('./EBMLElement/Segment').default,
  // Level-1 element - SeekHead
  'SeekHead': require('./EBMLElement/SeekHead').default,
  'Seek': require('./EBMLElement/Seek').default,
  'SeekID': require('./EBMLElement/SeekID').default,
  'SeekPosition': require('./EBMLElement/SeekPosition').default,
  // Level-1 element - Info
  'Info': require('./EBMLElement/Info').default,
  'SegmentUID': require('./EBMLElement/SegmentUID').default,
  'TimecodeScale': require('./EBMLElement/TimecodeScale').default,
  'Duration': require('./EBMLElement/Duration').default,
  'DateUTC': require('./EBMLElement/DateUTC').default,
  'Title': require('./EBMLElement/Title').default,
  'MuxingApp': require('./EBMLElement/MuxingApp').default,
  'WritingApp': require('./EBMLElement/WritingApp').default,
  // Level-1 element - Cluster
  'Cluster': require('./EBMLElement/Cluster').default,
  'Timecode': require('./EBMLElement/Timecode').default,
  'PrevSize': require('./EBMLElement/PrevSize').default,
  'SimpleBlock': require('./EBMLElement/SimpleBlock').default,
  'BlockGroup': require('./EBMLElement/BlockGroup').default,
  'Block': require('./EBMLElement/Block').default,
  'BlockAdditions': require('./EBMLElement/BlockAdditions').default,
  'BlockMore': require('./EBMLElement/BlockMore').default,
  'BlockAddID': require('./EBMLElement/BlockAddID').default,
  'BlockAdditional': require('./EBMLElement/BlockAdditional').default,
  'BlockDuration': require('./EBMLElement/BlockDuration').default,
  'ReferenceBlock': require('./EBMLElement/ReferenceBlock').default,
  'DiscardPadding': require('./EBMLElement/DiscardPadding').default,
  // Level-1 element - Tracks
  'Tracks': require('./EBMLElement/Tracks').default,
  'TrackEntry': require('./EBMLElement/TrackEntry').default,
  'TrackNumber': require('./EBMLElement/TrackNumber').default,
  'TrackUID': require('./EBMLElement/TrackUID').default,
  'TrackType': require('./EBMLElement/TrackType').default,
  'FlagEnabled': require('./EBMLElement/FlagEnabled').default,
  'FlagDefault': require('./EBMLElement/FlagDefault').default,
  'FlagForced': require('./EBMLElement/FlagForced').default,
  'FlagLacing': require('./EBMLElement/FlagLacing').default,
  'DefaultDuration': require('./EBMLElement/DefaultDuration').default,
  'Name': require('./EBMLElement/Name').default,
  'Language': require('./EBMLElement/Language').default,
  'CodecID': require('./EBMLElement/CodecID').default,
  'CodecPrivate': require('./EBMLElement/CodecPrivate').default,
  'CodecName': require('./EBMLElement/CodecName').default,
  'CodecDelay': require('./EBMLElement/CodecDelay').default,
  'SeekPreRoll': require('./EBMLElement/SeekPreRoll').default,
  'Video': require('./EBMLElement/Video').default,
  'FlagInterlaced': require('./EBMLElement/FlagInterlaced').default,
  'StereoMode': require('./EBMLElement/StereoMode').default,
  'AlphaMode': require('./EBMLElement/AlphaMode').default,
  'PixelWidth': require('./EBMLElement/PixelWidth').default,
  'PixelHeight': require('./EBMLElement/PixelHeight').default,
  'PixelCropBottom': require('./EBMLElement/PixelCropBottom').default,
  'PixelCropTop': require('./EBMLElement/PixelCropTop').default,
  'PixelCropLeft': require('./EBMLElement/PixelCropLeft').default,
  'PixelCropRight': require('./EBMLElement/PixelCropRight').default,
  'DisplayWidth': require('./EBMLElement/DisplayWidth').default,
  'DisplayHeight': require('./EBMLElement/DisplayHeight').default,
  'DisplayUnit': require('./EBMLElement/DisplayUnit').default,
  'AspectRatioType': require('./EBMLElement/AspectRatioType').default,
  'Audio': require('./EBMLElement/Audio').default,
  'SamplingFrequency': require('./EBMLElement/SamplingFrequency').default,
  'OutputSamplingFrequency': require('./EBMLElement/OutputSamplingFrequency').default,
  'Channels': require('./EBMLElement/Channels').default,
  'BitDepth': require('./EBMLElement/BitDepth').default,
  'ContentEncodings': require('./EBMLElement/ContentEncodings').default,
  'ContentEncoding': require('./EBMLElement/ContentEncoding').default,
  'ContentEncodingOrder': require('./EBMLElement/ContentEncodingOrder').default,
  'ContentEncodingScope': require('./EBMLElement/ContentEncodingScope').default,
  'ContentEncodingType': require('./EBMLElement/ContentEncodingType').default,
  'ContentEncryption': require('./EBMLElement/ContentEncryption').default,
  'ContentEncAlgo': require('./EBMLElement/ContentEncAlgo').default,
  'ContentEncKeyID': require('./EBMLElement/ContentEncKeyID').default,
  'ContentEncAESSettings': require('./EBMLElement/ContentEncAESSettings').default,
  'AESSettingsCipherMode': require('./EBMLElement/AESSettingsCipherMode').default,
  // Level-1 element - Cues
  'Cues': require('./EBMLElement/Cues').default,
  'CuePoint': require('./EBMLElement/CuePoint').default,
  'CueTime': require('./EBMLElement/CueTime').default,
  'CueTrackPositions': require('./EBMLElement/CueTrackPositions').default,
  'CueTrack': require('./EBMLElement/CueTrack').default,
  'CueClusterPosition': require('./EBMLElement/CueClusterPosition').default,
  'CueRelativePosition': require('./EBMLElement/CueRelativePosition').default,
  'CueDuration': require('./EBMLElement/CueDuration').default,
  'CueBlockNumber': require('./EBMLElement/CueBlockNumber').default,
  // Level-1 element - Chapters
  'Chapters': require('./EBMLElement/Chapters').default,
  'EditionEntry': require('./EBMLElement/EditionEntry').default,
  'ChapterAtom': require('./EBMLElement/ChapterAtom').default,
  'ChapterUID': require('./EBMLElement/ChapterUID').default,
  'ChapterStringUID': require('./EBMLElement/ChapterStringUID').default,
  'ChapterTimeStart': require('./EBMLElement/ChapterTimeStart').default,
  'ChapterTimeEnd': require('./EBMLElement/ChapterTimeEnd').default,
  'ChapterDisplay': require('./EBMLElement/ChapterDisplay').default,
  'ChapString': require('./EBMLElement/ChapString').default,
  'ChapLanguage': require('./EBMLElement/ChapLanguage').default,
  'ChapCountry': require('./EBMLElement/ChapCountry').default,
  // Level-1 element - Tags
  'Tags': require('./EBMLElement/Tags').default,
  'Tag': require('./EBMLElement/Tag').default,
  'Targets': require('./EBMLElement/Targets').default,
  'TargetTypeValue': require('./EBMLElement/TargetTypeValue').default,
  'TargetType': require('./EBMLElement/TargetType').default,
  'TagTrackUID': require('./EBMLElement/TagTrackUID').default,
  'SimpleTag': require('./EBMLElement/SimpleTag').default,
  'TagName': require('./EBMLElement/TagName').default,
  'TagLanguage': require('./EBMLElement/TagLanguage').default,
  'TagDefault': require('./EBMLElement/TagDefault').default,
  'TagString': require('./EBMLElement/TagString').default,
  'TagBinary': require('./EBMLElement/TagBinary').default,
};

const CLASS_D_IDS = [
  clazz['EBML'],
  clazz['Segment'],
  clazz['SeekHead'],
  clazz['Info'],
  clazz['Cluster'],
  clazz['Tracks'],
  clazz['Cues'],
  clazz['Chapters'],
  clazz['Tags'],
];

const CLASS_C_IDS = [
  clazz['TimecodeScale'],
  clazz['DefaultDuration'],
  clazz['Language'],
  clazz['CodecName']
];

const CLASS_B_IDS = [
  clazz['EBMLVersion'],
  clazz['EBMLReadVersion'],
  clazz['EBMLMaxIDLength'],
  clazz['EBMLMaxSizeLength'],
  clazz['DocType'],
  clazz['DocTypeVersion'],
  clazz['DocTypeReadVersion'],
  clazz['Seek'],
  clazz['SeekID'],
  clazz['SeekPosition'],
  clazz['SegmentUID'],
  clazz['Duration'],
  clazz['DateUTC'],
  clazz['Title'],
  clazz['MuxingApp'],
  clazz['WritingApp'],
  clazz['BlockAdditions'],
  clazz['DiscardPadding'],
  clazz['TrackUID'],
  clazz['FlagForced'],
  clazz['Name'],
  clazz['CodecPrivate'],
  clazz['CodecDelay'],
  clazz['SeekPreRoll'],
  clazz['StereoMode'],
  clazz['AlphaMode'],
  clazz['PixelCropBottom'],
  clazz['PixelCropTop'],
  clazz['PixelCropLeft'],
  clazz['PixelCropRight'],
  clazz['DisplayWidth'],
  clazz['DisplayHeight'],
  clazz['DisplayUnit'],
  clazz['AspectRatioType'],
  clazz['OutputSamplingFrequency'],
  clazz['BitDepth'],
  clazz['ContentEncodings'],
  clazz['ContentEncoding'],
  clazz['ContentEncodingOrder'],
  clazz['ContentEncodingScope'],
  clazz['ContentEncodingType'],
  clazz['ContentEncryption'],
  clazz['ContentEncAlgo'],
  clazz['ContentEncKeyID'],
  clazz['ContentEncAESSettings'],
  clazz['AESSettingsCipherMode'],
  clazz['CueBlockNumber'],
  clazz['EditionEntry'],
  clazz['ChapterUID'],
  clazz['ChapterStringUID'],
  clazz['ChapLanguage'],
  clazz['ChapCountry'],
  clazz['Tag'],
  clazz['Targets'],
  clazz['TargetTypeValue'],
  clazz['TargetType'],
  clazz['TagTrackUID'],
  clazz['SimpleTag'],
  clazz['TagName'],
  clazz['TagLanguage'],
  clazz['TagDefault'],
  clazz['TagString'],
  clazz['TagBinary'],
];

const CLASS_A_IDS = [
  clazz['Void'],
  clazz['Timecode'],
  clazz['PrevSize'],
  clazz['SimpleBlock'],
  clazz['BlockGroup'],
  clazz['Block'],
  clazz['BlockMore'],
  clazz['BlockAddID'],
  clazz['BlockAdditional'],
  clazz['BlockDuration'],
  clazz['ReferenceBlock'],
  clazz['TrackEntry'],
  clazz['TrackNumber'],
  clazz['TrackType'],
  clazz['FlagEnabled'],
  clazz['FlagDefault'],
  clazz['FlagLacing'],
  clazz['CodecID'],
  clazz['Video'],
  clazz['FlagInterlaced'],
  clazz['PixelWidth'],
  clazz['PixelHeight'],
  clazz['Audio'],
  clazz['SamplingFrequency'],
  clazz['Channels'],
  clazz['CuePoint'],
  clazz['CueTime'],
  clazz['CueTrackPositions'],
  clazz['CueTrack'],
  clazz['CueClusterPosition'],
  clazz['CueRelativePosition'],
  clazz['CueDuration'],
  clazz['ChapterAtom'],
  clazz['ChapterTimeStart'],
  clazz['ChapterTimeEnd'],
  clazz['ChapterDisplay'],
  clazz['ChapString']
];

const CLASS_A_INDICES = CLASS_A_IDS.map((item) => item.ELEMENT_ID[0]);
const CLASS_B_INDICES = null;
const CLASS_C_INDICES = CLASS_C_IDS.map((item) => item.ELEMENT_ID[0]);
const CLASS_D_INDICES = CLASS_D_IDS.map((item) => item.ELEMENT_ID[0]);

const CLASS_LOOKUP_TABLE = [
  {
    indices: CLASS_A_INDICES,
    idList: CLASS_A_IDS
  },
  {
    indices: CLASS_B_INDICES,
    idList: CLASS_B_IDS
  },
  {
    indices: CLASS_C_INDICES,
    idList: CLASS_C_IDS
  },
  {
    indices: CLASS_D_INDICES,
    idList: CLASS_D_IDS
  }
];

function lookupByName(name) {
  return clazz[name];
}

function lookupById(id) {
  const table = CLASS_LOOKUP_TABLE[id.length - 1];
  const indices = table.indices;
  let elementClass;

  if (indices) {
    const index = indices.indexOf(id[0]);
    if (index !== -1) {
      elementClass = table.idList[index];
    }
  } else {
    elementClass = table.idList.find((item) => {
      const bytes = item.ELEMENT_ID;
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] !== id[i]) {
          return false;
        }
      }
      return true;
    });
  }

  if (!elementClass) {
    return createUnknownElement(id);
  }
  return elementClass;
}

export default {
  lookupByName,
  lookupById
};
