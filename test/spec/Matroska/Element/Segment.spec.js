import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('Segment', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const frame = (new Array(63)).fill(1);
  const data = (new Array(1000)).fill(1);

  let cluster = [
        31, 67, 182, 117, 16, 0, 9, 83, // EBML-id [1F][43][B6][75], size=6+5+71+71+1117+1117=2387 [10][00][09][53]
        231, 132, 255, 255, 255, 255, // EBML-id [E7], size=4 [84], timestamp=4294967295
        171, 131, 1, 0, 0, // EBML-id [ab], size=3 [83], version=65536
      ];

  let simpleBlock = [
        163, 197, // EBML-id [A1], size=6+63=69 [C5]
        254, // Track Number=126
        0, 33, // Timecode=33 (ms)
        134, // Keyframe=true, Invisible=false, Lacing=EBML, Discardable=false
        0, // Number of frames in the lace-1
        191, // Lacing sizes=63 [BF]
      ];

  simpleBlock = simpleBlock.concat(frame);

  cluster = cluster.concat(simpleBlock, simpleBlock);

  let blockGroup = [
        160, 68, 90, // EBML-id [A0], size=71+1027+16=1114 [44][5A]
      ];

  let block = [
        161, 197, // EBML-id [A1], size=6+63=69 [C5]
        254, // Track Number=126
        0, 33, // Timecode=33 (ms)
        14, // Invisible=true, Lacing=EBML
        0, // Number of frames in the lace-1
        191, // Lacing sizes=63 [BF]
      ];

  block = block.concat(frame);

  let blockAdditions = [
        117, 161, 67, 255, // EBML-id [75][A1], size=1023 [43][ff]
        166, 64, 11, // EBML-id [A6], size=11 [04][0b]
        238, 130, 1, 244, // EBML-id [EE], size=2 [82], id=500 [01][f4]
        165, 133, 1, 2, 3, 4, 5, // EBML-id [A5], size=5 [85], data=[1,2,3,4,5]
        166, 67, 238, // EBML-id [A6], size=1006 [43][EE]
        238, 129, 1, // EBML-id [EE], size=1 [81], id=1 [1]
        165, 67, 232, // EBML-id [A5], size=1000 [43][e8]
      ];

  blockAdditions = blockAdditions.concat(data);

  const others = [
        155, 130, 2, 148, // EBML-id [9B], size=2 [82], duration=660 [02][94]
        251, 129, 33, // EBML-id [FB], size=1 [81], relative timestamp=33 [21]
        251, 129, 33, // EBML-id [FB], size=1 [81], relative timestamp=33 [21]
        117, 162, 131, 255, 0, 0, // EBML-id [75][A2], size=1 [83], padding=-65536 [FF][00][00]
      ];

  blockGroup = blockGroup.concat(block, blockAdditions, others);

  cluster = cluster.concat(blockGroup, blockGroup);

  const tracks = [
        22, 84, 174, 107, 16, 0, 2, 58, // EBML-id [16][54][AE][6B], size=570 [10][00][02][3A]
        174, 65, 26, // EBML-id [AE], size=282 [41][1A]
        215, 129, 127, // EBML-id [D7], size=1 [81], track number=127
        115, 197, 132, 255, 255, 255, 255, // EBML-id [73][C5], size=1 [84], id=[FF][FF][FF][FF]
        131, 129, 1, // EBML-id [83], size=1 [81], type=video [1]
        185, 129, 1, // EBML-id [B9], size=1 [81], enabled
        136, 129, 0, // EBML-id [88], size=1 [81], isNotDefault
        85, 170, 129, 1, // EBML-id [55][AA], size=1 [81], isForced
        156, 129, 0, // EBML-id [9C], size=1 [81], notUsingLacing
        35, 227, 131, 134, 6, 140, 97, 113, 64, 0, // EBML-id [23][E3][83], size=6 [86], duration=2 hours (in nanosec)
        83, 110, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [53][6E], size=21 [95], name=”I'm a seagull" in Japanese
        34, 181, 156, 131, 106, 112, 110, // EBML-id [22][B5][9C], size=3 [83], country="jpn"
        134, 136, 65, 95, 86, 79, 82, 66, 73, 83, // EBML-id [86], size=8 [88], codec id="A_VORBIS"
        99, 162, 133, 1, 2, 3, 4, 5, // EBML-id [63][A2], size=5 [85], version=1
        37, 134, 136, 146, 227, 129, 136, 227, 129, 131, 227, 129, 161, 228, 186, 140, 229, 133, 173, 229, 155, 155, // EBML-id [25][86][88], size=18 [92], name="H.264" in Japanese
        86, 170, 131, 76, 75, 64, // EBML-id [56][AA], size=3 [83], delay=5ms
        86, 187, 132, 59, 154, 202, 0, // EBML-id [56][BB], size=4 [84], time=1sec
        224, 181, // EBML-id [E0], size=53 [B5]
        154, 129, 2, // EBML-id [9A], size=1 [81], type=progressive [2]
        83, 184, 129, 13, // EBML-id [53][B8], size=1 [81], mode=both eyes laced in one Block [0D]
        83, 192, 129, 1, // EBML-id [53][C0], size=1 [81], hasAlpha
        176, 130, 7, 128, // EBML-id [B0], size=2 [82], width=1920
        186, 130, 4, 56, // EBML-id [BA], size=2 [82], height=1080
        84, 170, 129, 80, // EBML-id [54][AA], size=1 [81], bottom=80px
        84, 187, 129, 80, // EBML-id [54][BB], size=1 [81], top=80px
        84, 204, 129, 60, // EBML-id [54][CC], size=1 [81], left=60px
        84, 221, 129, 60, // EBML-id [54][DD], size=1 [81], right=60
        84, 176, 130, 6, 224, // EBML-id [54][B0], size=2 [82], width=1760
        84, 186, 130, 3, 192, // EBML-id [54][BA], size=2 [82], height=960
        84, 178, 129, 3, // EBML-id [54][B2], size=1 [81], kind=aspectRatio
        84, 179, 129, 1, // EBML-id [54][B3], size=1 [81], kind=keep
        225, 156, // EBML-id [E1], size=28 [9C]
        181, 136, 0, 0, 172, 68, 0, 0, 0, 0, // EBML-id [B5], size=8 [88], samplingRate=44.1kHz
        120, 181, 136, 0, 0, 125, 0, 0, 0, 0, 0, // EBML-id [78][B5], size=8 [88], samplingRate=32kHz
        159, 129, 2, // EBML-id [9F], size=1 [81], channels=stereo
        98, 100, 129, 8, // EBML-id [62][64], size=1 [81], depth=8
        109, 128, 202, // EBML-id [6D][80], size=74 [CA]
        98, 64, 162, // EBML-id [62][40], size=34 [A2]
        80, 49, 129, 0, // EBML-id [50][31], size=1 [81], order=0
        80, 50, 129, 3, // EBML-id [50][32], size=1 [81], encrypted=(frame|private)
        80, 51, 129, 1, // EBML-id [50][33], size=1 [81], type=encryption [1]
        80, 53, 147, // EBML-id [50][35], size=19 [93]
        71, 225, 129, 5, // EBML-id [47][E1], size=1 [81], algorithm=AES [5]
        71, 226, 133, 1, 2, 3, 4, 5, // EBML-id [47][E2], size=5 [85], keyId
        71, 231, 132, // EBML-id [47][E7], size=4 [84]
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
        98, 64, 162, // EBML-id [62][40], size=34 [A2]
        80, 49, 129, 0, // EBML-id [50][31], size=1 [81], order=0
        80, 50, 129, 3, // EBML-id [50][32], size=1 [81], encrypted=(frame|private)
        80, 51, 129, 1, // EBML-id [50][33], size=1 [81], type=encryption [1]
        80, 53, 147, // EBML-id [50][35], size=19 [93]
        71, 225, 129, 5, // EBML-id [47][E1], size=1 [81], algorithm=AES [5]
        71, 226, 133, 1, 2, 3, 4, 5, // EBML-id [47][E2], size=5 [85], keyId
        71, 231, 132, // EBML-id [47][E7], size=4 [84]
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
        174, 65, 26, // EBML-id [AE], size=282 [41][1A]
        215, 129, 127, // EBML-id [D7], size=1 [81], track number=127
        115, 197, 132, 255, 255, 255, 255, // EBML-id [73][C5], size=1 [84], id=[FF][FF][FF][FF]
        131, 129, 1, // EBML-id [83], size=1 [81], type=video [1]
        185, 129, 1, // EBML-id [B9], size=1 [81], enabled
        136, 129, 0, // EBML-id [88], size=1 [81], isNotDefault
        85, 170, 129, 1, // EBML-id [55][AA], size=1 [81], isForced
        156, 129, 0, // EBML-id [9C], size=1 [81], notUsingLacing
        35, 227, 131, 134, 6, 140, 97, 113, 64, 0, // EBML-id [23][E3][83], size=6 [86], duration=2 hours (in nanosec)
        83, 110, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [53][6E], size=21 [95], name=”I'm a seagull" in Japanese
        34, 181, 156, 131, 106, 112, 110, // EBML-id [22][B5][9C], size=3 [83], country="jpn"
        134, 136, 65, 95, 86, 79, 82, 66, 73, 83, // EBML-id [86], size=8 [88], codec id="A_VORBIS"
        99, 162, 133, 1, 2, 3, 4, 5, // EBML-id [63][A2], size=5 [85], version=1
        37, 134, 136, 146, 227, 129, 136, 227, 129, 131, 227, 129, 161, 228, 186, 140, 229, 133, 173, 229, 155, 155, // EBML-id [25][86][88], size=18 [92], name="H.264" in Japanese
        86, 170, 131, 76, 75, 64, // EBML-id [56][AA], size=3 [83], delay=5ms
        86, 187, 132, 59, 154, 202, 0, // EBML-id [56][BB], size=4 [84], time=1sec
        224, 181, // EBML-id [E0], size=53 [B5]
        154, 129, 2, // EBML-id [9A], size=1 [81], type=progressive [2]
        83, 184, 129, 13, // EBML-id [53][B8], size=1 [81], mode=both eyes laced in one Block [0D]
        83, 192, 129, 1, // EBML-id [53][C0], size=1 [81], hasAlpha
        176, 130, 7, 128, // EBML-id [B0], size=2 [82], width=1920
        186, 130, 4, 56, // EBML-id [BA], size=2 [82], height=1080
        84, 170, 129, 80, // EBML-id [54][AA], size=1 [81], bottom=80px
        84, 187, 129, 80, // EBML-id [54][BB], size=1 [81], top=80px
        84, 204, 129, 60, // EBML-id [54][CC], size=1 [81], left=60px
        84, 221, 129, 60, // EBML-id [54][DD], size=1 [81], right=60
        84, 176, 130, 6, 224, // EBML-id [54][B0], size=2 [82], width=1760
        84, 186, 130, 3, 192, // EBML-id [54][BA], size=2 [82], height=960
        84, 178, 129, 3, // EBML-id [54][B2], size=1 [81], kind=aspectRatio
        84, 179, 129, 1, // EBML-id [54][B3], size=1 [81], kind=keep
        225, 156, // EBML-id [E1], size=28 [9C]
        181, 136, 0, 0, 172, 68, 0, 0, 0, 0, // EBML-id [B5], size=8 [88], samplingRate=44.1kHz
        120, 181, 136, 0, 0, 125, 0, 0, 0, 0, 0, // EBML-id [78][B5], size=8 [88], samplingRate=32kHz
        159, 129, 2, // EBML-id [9F], size=1 [81], channels=stereo
        98, 100, 129, 8, // EBML-id [62][64], size=1 [81], depth=8
        109, 128, 202, // EBML-id [6D][80], size=74 [CA]
        98, 64, 162, // EBML-id [62][40], size=34 [A2]
        80, 49, 129, 0, // EBML-id [50][31], size=1 [81], order=0
        80, 50, 129, 3, // EBML-id [50][32], size=1 [81], encrypted=(frame|private)
        80, 51, 129, 1, // EBML-id [50][33], size=1 [81], type=encryption [1]
        80, 53, 147, // EBML-id [50][35], size=19 [93]
        71, 225, 129, 5, // EBML-id [47][E1], size=1 [81], algorithm=AES [5]
        71, 226, 133, 1, 2, 3, 4, 5, // EBML-id [47][E2], size=5 [85], keyId
        71, 231, 132, // EBML-id [47][E7], size=4 [84]
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
        98, 64, 162, // EBML-id [62][40], size=34 [A2]
        80, 49, 129, 0, // EBML-id [50][31], size=1 [81], order=0
        80, 50, 129, 3, // EBML-id [50][32], size=1 [81], encrypted=(frame|private)
        80, 51, 129, 1, // EBML-id [50][33], size=1 [81], type=encryption [1]
        80, 53, 147, // EBML-id [50][35], size=19 [93]
        71, 225, 129, 5, // EBML-id [47][E1], size=1 [81], algorithm=AES [5]
        71, 226, 133, 1, 2, 3, 4, 5, // EBML-id [47][E2], size=5 [85], keyId
        71, 231, 132, // EBML-id [47][E7], size=4 [84]
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
      ];

  const cues = [
        28, 83, 187, 107, 64, 116, // EBML-id [1C][53][BB][6B]	, size=116 [40][74]
        187, 184, // EBML-id [BB], size=56 [B8]
        179, 134, 6, 140, 97, 113, 64, 0, // EBML-id [B3], size=6 [86], timestamp=2 hours (in nanosec)
        183, 150, // EBML-id [B7], size=22 [96]
        247, 129, 127, // EBML-id [F7], size=1 [81], trackUID=127
        241, 131, 1, 0, 0, // EBML-id [F1], size=3 [83], position=65536
        240, 130, 5, 0, // EBML-id [F0], size=2 [82], offset=1280 [05][00]
        178, 132, 1, 247, 138, 64, // EBML-id [B2], size=4 [84], duration=33ms [01][F7][8A][40]
        83, 120, 129, 3, // EBML-id [53][78], size=1 [83], num=3
        183, 150, // EBML-id [B7], size=22 [96]
        247, 129, 127, // EBML-id [F7], size=1 [81], trackUID=127
        241, 131, 1, 0, 0, // EBML-id [F1], size=3 [83], position=65536
        240, 130, 5, 0, // EBML-id [F0], size=2 [82], offset=1280 [05][00]
        178, 132, 1, 247, 138, 64, // EBML-id [B2], size=4 [84], duration=33ms [01][F7][8A][40]
        83, 120, 129, 3, // EBML-id [53][78], size=1 [83], num=3
        187, 184, // EBML-id [BB], size=56 [B8]
        179, 134, 6, 140, 97, 113, 64, 0, // EBML-id [B3], size=6 [86], timestamp=2 hours (in nanosec)
        183, 150, // EBML-id [B7], size=22 [96]
        247, 129, 127, // EBML-id [F7], size=1 [81], trackUID=127
        241, 131, 1, 0, 0, // EBML-id [F1], size=3 [83], position=65536
        240, 130, 5, 0, // EBML-id [F0], size=2 [82], offset=1280 [05][00]
        178, 132, 1, 247, 138, 64, // EBML-id [B2], size=4 [84], duration=33ms [01][F7][8A][40]
        83, 120, 129, 3, // EBML-id [53][78], size=1 [83], num=3
        183, 150, // EBML-id [B7], size=22 [96]
        247, 129, 127, // EBML-id [F7], size=1 [81], trackUID=127
        241, 131, 1, 0, 0, // EBML-id [F1], size=3 [83], position=65536
        240, 130, 5, 0, // EBML-id [F0], size=2 [82], offset=1280 [05][00]
        178, 132, 1, 247, 138, 64, // EBML-id [B2], size=4 [84], duration=33ms [01][F7][8A][40]
        83, 120, 129, 3, // EBML-id [53][78], size=1 [83], num=3
      ];

  const chapters = [
        16, 67, 167, 112, 16, 0, 1, 228, // EBML-id [10][43][A7][70], size=484 [10][00][01][E4]
        69, 185, 64, 238, // EBML-id [45][B9], size=238 [40][EE]
        182, 64, 116, // EBML-id [B6], size=116 [40][74]
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
        145, 134, 6, 140, 97, 113, 64, 0, // EBML-id [91], size=6 [86], duration=2 hours (in nanosec)
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        182, 64, 116, // EBML-id [B6], size=116 [40][74]
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
        145, 134, 6, 140, 97, 113, 64, 0, // EBML-id [91], size=6 [86], duration=2 hours (in nanosec)
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        69, 185, 64, 238, // EBML-id [45][B9], size=238 [40][EE]
        182, 64, 116, // EBML-id [B6], size=116 [40][74]
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
        145, 134, 6, 140, 97, 113, 64, 0, // EBML-id [91], size=6 [86], duration=2 hours (in nanosec)
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        182, 64, 116, // EBML-id [B6], size=116 [40][74]
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
        145, 134, 6, 140, 97, 113, 64, 0, // EBML-id [91], size=6 [86], duration=2 hours (in nanosec)
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
      ];

  const tags = [
        18, 84, 195, 103, 16, 0, 1, 10, // EBML-id [12][54][C3][67], size=[01][0A]
        115, 115, 64, 129, // EBML-id [73][73], size=129 [40][81]
        99, 192, 144, // EBML-id [63][C0], size=16 [90]
        104, 202, 129, 48, // EBML-id [68][CA], size=1 [81], value=0x30
        99, 202, 133, 65, 76, 66, 85, 77, // EBML-id [63][CA], size=5 [85], country="ALBUM"
        99, 197, 129, 127, // EBML-id [63][C5], size=1 [81], id=127
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
        115, 115, 64, 129, // EBML-id [73][73], size=129 [40][81]
        99, 192, 144, // EBML-id [63][C0], size=16 [90]
        104, 202, 129, 48, // EBML-id [68][CA], size=1 [81], value=0x30
        99, 202, 133, 65, 76, 66, 85, 77, // EBML-id [63][CA], size=5 [85], country="ALBUM"
        99, 197, 129, 127, // EBML-id [63][C5], size=1 [81], id=127
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
      ];

  let value = [
        24, 83, 128, 103, 1, 0, 0, 0, 0, 0, 28, 166, // EBML-id [18][53][80][67], size=226+2395*2+578*2+122+492+274*2=7334 [01][00][00][00][00][00][1C][A6]
        17, 77, 155, 116, 64, 30, // EBML-id [11][4D][9B][74] size=30 [40][1E]
        77, 187, 139, // EBML-id [4D][BB], size=11 [8B]
        83, 171, 132, 26, 69, 223, 163, // EBML-id [53][AB], size=4 [84], id=[1A][45][DF][A3] :EBML
        83, 172, 129, 64, // EBML-id [53][AC], size=1 [81], position=64
        77, 187, 141, // EBML-id [4D][BB], size=13 [8D],
        83, 171, 132, 26, 69, 223, 163, // EBML-id [53][AB], size=4 [84], id=[1A][45][DF][A3] :EBML
        83, 172, 131, 1, 0, 0, // EBML-id [53][AC], size=3 [83], position=65536
        17, 77, 155, 116, 64, 30, // EBML-id [11][4D][9B][74] size=30 [40][1E]
        77, 187, 139, // EBML-id [4D][BB], size=11 [8B]
        83, 171, 132, 26, 69, 223, 163, // EBML-id [53][AB], size=4 [84], id=[1A][45][DF][A3] :EBML
        83, 172, 129, 64, // EBML-id [53][AC], size=1 [81], position=64
        77, 187, 141, // EBML-id [4D][BB], size=13 [8D],
        83, 171, 132, 26, 69, 223, 163, // EBML-id [53][AB], size=4 [84], id=[1A][45][DF][A3] :EBML
        83, 172, 131, 1, 0, 0, // EBML-id [53][AC], size=3 [83], position=65536
        21, 73, 169, 102, 64, 71, // EBML-id [15][49][A9][66] size=71 [40][49]
        42, 215, 177, 131, 30, 132, 128, // EBML-id [2A][D7][B1], size=3 [83], timestamp scale=2000000(ns) [1E][84][80]
        68, 137, 136, 0, 1, 0, 0, 0, 0, 0, 0, // EBML-id [44][89], size=8 [88], duration=65536.0 [00][01][00][00][00][00][00][00]
        68, 97, 136, 6, 145, 97, 165, 169, 252, 96, 0, // EBML-id [44][61], size=8 [88], date=2016/01/01(JST)
        123, 169, 137, 227, 131, 134, 227, 130, 185, 227, 131, 136, // EBML-id [7B][A9], size=9 [89], title="TEST(in Japanese)" [E3, 83, 86, E3, 82, B9, E3, 83, 88]
        77, 128, 140, 107, 111, 110, 116, 97, 105, 110, 101, 114, 45, 106, 115, // EBML-id [4D][80], size=12 [8C], title="kontainer-js"
        87, 65, 140, 107, 111, 110, 116, 97, 105, 110, 101, 114, 45, 106, 115, // EBML-id [57][41], size=12 [8C], title="kontainer-js"
        21, 73, 169, 102, 64, 71, // EBML-id [15][49][A9][66] size=71 [40][49]
        42, 215, 177, 131, 30, 132, 128, // EBML-id [2A][D7][B1], size=3 [83], timestamp scale=2000000(ns) [1E][84][80]
        68, 137, 136, 0, 1, 0, 0, 0, 0, 0, 0, // EBML-id [44][89], size=8 [88], duration=65536.0 [00][01][00][00][00][00][00][00]
        68, 97, 136, 6, 145, 97, 165, 169, 252, 96, 0, // EBML-id [44][61], size=8 [88], date=2016/01/01(JST)
        123, 169, 137, 227, 131, 134, 227, 130, 185, 227, 131, 136, // EBML-id [7B][A9], size=9 [89], title="TEST(in Japanese)" [E3, 83, 86, E3, 82, B9, E3, 83, 88]
        77, 128, 140, 107, 111, 110, 116, 97, 105, 110, 101, 114, 45, 106, 115, // EBML-id [4D][80], size=12 [8C], title="kontainer-js"
        87, 65, 140, 107, 111, 110, 116, 97, 105, 110, 101, 114, 45, 106, 115, // EBML-id [57][41], size=12 [8C], title="kontainer-js"
      ];

  value = value.concat(cluster, cluster, tracks, tracks, cues, chapters, tags, tags);

  it('should parse/serialize the Segment element', () => {
    const buf = new Buffer([1, 2, 3, 4, 5]).getView();
    const element1 = <Segment>
      <SeekHead>
        <Seek>
          <SeekID value="EBML" />
          <SeekPosition value={64} />
        </Seek>
        <Seek>
          <SeekID value="EBML" />
          <SeekPosition value={65536} />
        </Seek>
      </SeekHead>
      <SeekHead>
        <Seek>
          <SeekID value="EBML" />
          <SeekPosition value={64} />
        </Seek>
        <Seek>
          <SeekID value="EBML" />
          <SeekPosition value={65536} />
        </Seek>
      </SeekHead>
      <Info>
        <TimecodeScale value={2000000} />
        <Duration value={65536} />
        <DateUTC value={new Date('2016/01/01 00:00:00 +0900')} />
        <Title value={'\u30C6\u30B9\u30C8'} />
        <MuxingApp value="kontainer-js" />
        <WritingApp value="kontainer-js" />
      </Info>
      <Info>
        <TimecodeScale value={2000000} />
        <Duration value={65536} />
        <DateUTC value={new Date('2016/01/01 00:00:00 +0900')} />
        <Title value={'\u30C6\u30B9\u30C8'} />
        <MuxingApp value="kontainer-js" />
        <WritingApp value="kontainer-js" />
      </Info>
      <Cluster>
        <Timecode value={4294967295} />
        <PrevSize value={65536} />
        <SimpleBlock {...{
          trackNumber: 126,
          timecode: 33,
          flags: {keyframe: true, invisible: false, discardable: false},
          frames: [new Buffer(frame).getView()]
        }} />
        <SimpleBlock {...{
          trackNumber: 126,
          timecode: 33,
          flags: {keyframe: true, invisible: false, discardable: false},
          frames: [new Buffer(frame).getView()]
        }} />
        <BlockGroup>
          <Block {...{
            trackNumber: 126,
            timecode: 33,
            flags: {invisible: true},
            frames: [new Buffer(frame).getView()]
          }} />
          <BlockAdditions>
            <BlockMore>
              <BlockAddID value={500} />
              <BlockAdditional value={buf} />
            </BlockMore>
            <BlockMore>
              <BlockAddID value={1} />
              <BlockAdditional value={new Buffer(data).getView()} />
            </BlockMore>
          </BlockAdditions>
          <BlockDuration value={660} />
          <ReferenceBlock value={33} />
          <ReferenceBlock value={33} />
          <DiscardPadding value={-65536} />
        </BlockGroup>
        <BlockGroup>
          <Block {...{
            trackNumber: 126,
            timecode: 33,
            flags: {invisible: true},
            frames: [new Buffer(frame).getView()]
          }} />
          <BlockAdditions>
            <BlockMore>
              <BlockAddID value={500} />
              <BlockAdditional value={buf} />
            </BlockMore>
            <BlockMore>
              <BlockAddID value={1} />
              <BlockAdditional value={new Buffer(data).getView()} />
            </BlockMore>
          </BlockAdditions>
          <BlockDuration value={660} />
          <ReferenceBlock value={33} />
          <ReferenceBlock value={33} />
          <DiscardPadding value={-65536} />
        </BlockGroup>
      </Cluster>
      <Cluster>
        <Timecode value={4294967295} />
        <PrevSize value={65536} />
        <SimpleBlock {...{
          trackNumber: 126,
          timecode: 33,
          flags: {keyframe: true, invisible: false, discardable: false},
          frames: [new Buffer(frame).getView()]
        }} />
        <SimpleBlock {...{
          trackNumber: 126,
          timecode: 33,
          flags: {keyframe: true, invisible: false, discardable: false},
          frames: [new Buffer(frame).getView()]
        }} />
        <BlockGroup>
          <Block {...{
            trackNumber: 126,
            timecode: 33,
            flags: {invisible: true},
            frames: [new Buffer(frame).getView()]
          }} />
          <BlockAdditions>
            <BlockMore>
              <BlockAddID value={500} />
              <BlockAdditional value={buf} />
            </BlockMore>
            <BlockMore>
              <BlockAddID value={1} />
              <BlockAdditional value={new Buffer(data).getView()} />
            </BlockMore>
          </BlockAdditions>
          <BlockDuration value={660} />
          <ReferenceBlock value={33} />
          <ReferenceBlock value={33} />
          <DiscardPadding value={-65536} />
        </BlockGroup>
        <BlockGroup>
          <Block {...{
            trackNumber: 126,
            timecode: 33,
            flags: {invisible: true},
            frames: [new Buffer(frame).getView()]
          }} />
          <BlockAdditions>
            <BlockMore>
              <BlockAddID value={500} />
              <BlockAdditional value={buf} />
            </BlockMore>
            <BlockMore>
              <BlockAddID value={1} />
              <BlockAdditional value={new Buffer(data).getView()} />
            </BlockMore>
          </BlockAdditions>
          <BlockDuration value={660} />
          <ReferenceBlock value={33} />
          <ReferenceBlock value={33} />
          <DiscardPadding value={-65536} />
        </BlockGroup>
      </Cluster>
      <Tracks>
        <TrackEntry>
          <TrackNumber value={127} />
          <TrackUID value={0xffffffff} />
          <TrackType kind="video" />
          <FlagEnabled value={true} />
          <FlagDefault value={false} />
          <FlagForced value={true} />
          <FlagLacing value={false} />
          <DefaultDuration value={7200000000000} />
          <Name value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
          <Language value={"jpn"} />
          <CodecID value={"A_VORBIS"} />
          <CodecPrivate value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          <CodecName value={"\u3048\u3043\u3061\u4E8C\u516D\u56DB"} />
          <CodecDelay value={5000000} />;
          <SeekPreRoll value={1000000000} />
          <Video>
            <FlagInterlaced kind="progressive" />
            <StereoMode kind="bothEyesLacedInOneBlock-LeftFirst" />
            <AlphaMode value={true} />
            <PixelWidth value={1920} />
            <PixelHeight value={1080} />
            <PixelCropBottom value={80} />
            <PixelCropTop value={80} />
            <PixelCropLeft value={60} />
            <PixelCropRight value={60} />
            <DisplayWidth value={1760} />
            <DisplayHeight value={960} />
            <DisplayUnit kind={"aspectRatio"} />
            <AspectRatioType kind={"keep"} />
          </Video>
          <Audio>
            <SamplingFrequency value={44100} />
            <OutputSamplingFrequency value={32000} />
            <Channels value={2} />
            <BitDepth value={8} />
          </Audio>
          <ContentEncodings>
            <ContentEncoding>
              <ContentEncodingOrder value={0} />
              <ContentEncodingScope kind={['frame', 'private']} />
              <ContentEncodingType kind="encryption" />
              <ContentEncryption>
                <ContentEncAlgo kind="AES" />
                <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
                <ContentEncAESSettings>
                  <AESSettingsCipherMode kind={'CTR'} />
                </ContentEncAESSettings>
              </ContentEncryption>
            </ContentEncoding>
            <ContentEncoding>
              <ContentEncodingOrder value={0} />
              <ContentEncodingScope kind={['frame', 'private']} />
              <ContentEncodingType kind="encryption" />
              <ContentEncryption>
                <ContentEncAlgo kind="AES" />
                <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
                <ContentEncAESSettings>
                  <AESSettingsCipherMode kind={'CTR'} />
                </ContentEncAESSettings>
              </ContentEncryption>
            </ContentEncoding>
          </ContentEncodings>
        </TrackEntry>
        <TrackEntry>
          <TrackNumber value={127} />
          <TrackUID value={0xffffffff} />
          <TrackType kind="video" />
          <FlagEnabled value={true} />
          <FlagDefault value={false} />
          <FlagForced value={true} />
          <FlagLacing value={false} />
          <DefaultDuration value={7200000000000} />
          <Name value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
          <Language value={"jpn"} />
          <CodecID value={"A_VORBIS"} />
          <CodecPrivate value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          <CodecName value={"\u3048\u3043\u3061\u4E8C\u516D\u56DB"} />
          <CodecDelay value={5000000} />;
          <SeekPreRoll value={1000000000} />
          <Video>
            <FlagInterlaced kind="progressive" />
            <StereoMode kind="bothEyesLacedInOneBlock-LeftFirst" />
            <AlphaMode value={true} />
            <PixelWidth value={1920} />
            <PixelHeight value={1080} />
            <PixelCropBottom value={80} />
            <PixelCropTop value={80} />
            <PixelCropLeft value={60} />
            <PixelCropRight value={60} />
            <DisplayWidth value={1760} />
            <DisplayHeight value={960} />
            <DisplayUnit kind={"aspectRatio"} />
            <AspectRatioType kind={"keep"} />
          </Video>
          <Audio>
            <SamplingFrequency value={44100} />
            <OutputSamplingFrequency value={32000} />
            <Channels value={2} />
            <BitDepth value={8} />
          </Audio>
          <ContentEncodings>
            <ContentEncoding>
              <ContentEncodingOrder value={0} />
              <ContentEncodingScope kind={['frame', 'private']} />
              <ContentEncodingType kind="encryption" />
              <ContentEncryption>
                <ContentEncAlgo kind="AES" />
                <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
                <ContentEncAESSettings>
                  <AESSettingsCipherMode kind={'CTR'} />
                </ContentEncAESSettings>
              </ContentEncryption>
            </ContentEncoding>
            <ContentEncoding>
              <ContentEncodingOrder value={0} />
              <ContentEncodingScope kind={['frame', 'private']} />
              <ContentEncodingType kind="encryption" />
              <ContentEncryption>
                <ContentEncAlgo kind="AES" />
                <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
                <ContentEncAESSettings>
                  <AESSettingsCipherMode kind={'CTR'} />
                </ContentEncAESSettings>
              </ContentEncryption>
            </ContentEncoding>
          </ContentEncodings>
        </TrackEntry>
      </Tracks>
      <Tracks>
        <TrackEntry>
          <TrackNumber value={127} />
          <TrackUID value={0xffffffff} />
          <TrackType kind="video" />
          <FlagEnabled value={true} />
          <FlagDefault value={false} />
          <FlagForced value={true} />
          <FlagLacing value={false} />
          <DefaultDuration value={7200000000000} />
          <Name value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
          <Language value={"jpn"} />
          <CodecID value={"A_VORBIS"} />
          <CodecPrivate value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          <CodecName value={"\u3048\u3043\u3061\u4E8C\u516D\u56DB"} />
          <CodecDelay value={5000000} />;
          <SeekPreRoll value={1000000000} />
          <Video>
            <FlagInterlaced kind="progressive" />
            <StereoMode kind="bothEyesLacedInOneBlock-LeftFirst" />
            <AlphaMode value={true} />
            <PixelWidth value={1920} />
            <PixelHeight value={1080} />
            <PixelCropBottom value={80} />
            <PixelCropTop value={80} />
            <PixelCropLeft value={60} />
            <PixelCropRight value={60} />
            <DisplayWidth value={1760} />
            <DisplayHeight value={960} />
            <DisplayUnit kind={"aspectRatio"} />
            <AspectRatioType kind={"keep"} />
          </Video>
          <Audio>
            <SamplingFrequency value={44100} />
            <OutputSamplingFrequency value={32000} />
            <Channels value={2} />
            <BitDepth value={8} />
          </Audio>
          <ContentEncodings>
            <ContentEncoding>
              <ContentEncodingOrder value={0} />
              <ContentEncodingScope kind={['frame', 'private']} />
              <ContentEncodingType kind="encryption" />
              <ContentEncryption>
                <ContentEncAlgo kind="AES" />
                <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
                <ContentEncAESSettings>
                  <AESSettingsCipherMode kind={'CTR'} />
                </ContentEncAESSettings>
              </ContentEncryption>
            </ContentEncoding>
            <ContentEncoding>
              <ContentEncodingOrder value={0} />
              <ContentEncodingScope kind={['frame', 'private']} />
              <ContentEncodingType kind="encryption" />
              <ContentEncryption>
                <ContentEncAlgo kind="AES" />
                <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
                <ContentEncAESSettings>
                  <AESSettingsCipherMode kind={'CTR'} />
                </ContentEncAESSettings>
              </ContentEncryption>
            </ContentEncoding>
          </ContentEncodings>
        </TrackEntry>
        <TrackEntry>
          <TrackNumber value={127} />
          <TrackUID value={0xffffffff} />
          <TrackType kind="video" />
          <FlagEnabled value={true} />
          <FlagDefault value={false} />
          <FlagForced value={true} />
          <FlagLacing value={false} />
          <DefaultDuration value={7200000000000} />
          <Name value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
          <Language value={"jpn"} />
          <CodecID value={"A_VORBIS"} />
          <CodecPrivate value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          <CodecName value={"\u3048\u3043\u3061\u4E8C\u516D\u56DB"} />
          <CodecDelay value={5000000} />;
          <SeekPreRoll value={1000000000} />
          <Video>
            <FlagInterlaced kind="progressive" />
            <StereoMode kind="bothEyesLacedInOneBlock-LeftFirst" />
            <AlphaMode value={true} />
            <PixelWidth value={1920} />
            <PixelHeight value={1080} />
            <PixelCropBottom value={80} />
            <PixelCropTop value={80} />
            <PixelCropLeft value={60} />
            <PixelCropRight value={60} />
            <DisplayWidth value={1760} />
            <DisplayHeight value={960} />
            <DisplayUnit kind={"aspectRatio"} />
            <AspectRatioType kind={"keep"} />
          </Video>
          <Audio>
            <SamplingFrequency value={44100} />
            <OutputSamplingFrequency value={32000} />
            <Channels value={2} />
            <BitDepth value={8} />
          </Audio>
          <ContentEncodings>
            <ContentEncoding>
              <ContentEncodingOrder value={0} />
              <ContentEncodingScope kind={['frame', 'private']} />
              <ContentEncodingType kind="encryption" />
              <ContentEncryption>
                <ContentEncAlgo kind="AES" />
                <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
                <ContentEncAESSettings>
                  <AESSettingsCipherMode kind={'CTR'} />
                </ContentEncAESSettings>
              </ContentEncryption>
            </ContentEncoding>
            <ContentEncoding>
              <ContentEncodingOrder value={0} />
              <ContentEncodingScope kind={['frame', 'private']} />
              <ContentEncodingType kind="encryption" />
              <ContentEncryption>
                <ContentEncAlgo kind="AES" />
                <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
                <ContentEncAESSettings>
                  <AESSettingsCipherMode kind={'CTR'} />
                </ContentEncAESSettings>
              </ContentEncryption>
            </ContentEncoding>
          </ContentEncodings>
        </TrackEntry>
      </Tracks>
      <Cues>
        <CuePoint>
          <CueTime value={7200000000000} />
          <CueTrackPositions>
            <CueTrack value={127} />
            <CueClusterPosition value={65536} />
            <CueRelativePosition value={1280} />
            <CueDuration value={33000000} />
            <CueBlockNumber value={3} />
          </CueTrackPositions>
          <CueTrackPositions>
            <CueTrack value={127} />
            <CueClusterPosition value={65536} />
            <CueRelativePosition value={1280} />
            <CueDuration value={33000000} />
            <CueBlockNumber value={3} />
          </CueTrackPositions>
        </CuePoint>
        <CuePoint>
          <CueTime value={7200000000000} />
          <CueTrackPositions>
            <CueTrack value={127} />
            <CueClusterPosition value={65536} />
            <CueRelativePosition value={1280} />
            <CueDuration value={33000000} />
            <CueBlockNumber value={3} />
          </CueTrackPositions>
          <CueTrackPositions>
            <CueTrack value={127} />
            <CueClusterPosition value={65536} />
            <CueRelativePosition value={1280} />
            <CueDuration value={33000000} />
            <CueBlockNumber value={3} />
          </CueTrackPositions>
        </CuePoint>
      </Cues>
      <Chapters>
        <EditionEntry>
          <ChapterAtom>
            <ChapterUID value={127} />
            <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapterTimeStart value={7200000000000} />
            <ChapterTimeEnd value={7200000000000} />
            <ChapterDisplay>
              <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
              <ChapLanguage value={"jpn"} />
              <ChapCountry value={"jp"} />
            </ChapterDisplay>
            <ChapterDisplay>
              <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
              <ChapLanguage value={"jpn"} />
              <ChapCountry value={"jp"} />
            </ChapterDisplay>
          </ChapterAtom>
          <ChapterAtom>
            <ChapterUID value={127} />
            <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapterTimeStart value={7200000000000} />
            <ChapterTimeEnd value={7200000000000} />
            <ChapterDisplay>
              <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
              <ChapLanguage value={"jpn"} />
              <ChapCountry value={"jp"} />
            </ChapterDisplay>
            <ChapterDisplay>
              <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
              <ChapLanguage value={"jpn"} />
              <ChapCountry value={"jp"} />
            </ChapterDisplay>
          </ChapterAtom>
        </EditionEntry>
        <EditionEntry>
          <ChapterAtom>
            <ChapterUID value={127} />
            <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapterTimeStart value={7200000000000} />
            <ChapterTimeEnd value={7200000000000} />
            <ChapterDisplay>
              <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
              <ChapLanguage value={"jpn"} />
              <ChapCountry value={"jp"} />
            </ChapterDisplay>
            <ChapterDisplay>
              <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
              <ChapLanguage value={"jpn"} />
              <ChapCountry value={"jp"} />
            </ChapterDisplay>
          </ChapterAtom>
          <ChapterAtom>
            <ChapterUID value={127} />
            <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapterTimeStart value={7200000000000} />
            <ChapterTimeEnd value={7200000000000} />
            <ChapterDisplay>
              <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
              <ChapLanguage value={"jpn"} />
              <ChapCountry value={"jp"} />
            </ChapterDisplay>
            <ChapterDisplay>
              <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
              <ChapLanguage value={"jpn"} />
              <ChapCountry value={"jp"} />
            </ChapterDisplay>
          </ChapterAtom>
        </EditionEntry>
      </Chapters>
      <Tags>
        <Tag>
          <Targets>
            <TargetTypeValue value={0x30} />
            <TargetType value={"ALBUM"} />
            <TagTrackUID value={127} />
          </Targets>
          <SimpleTag>
            <TagName value={"Prince"} />
            <TagLanguage value={"jpn"} />
            <TagDefault value={false} />
            <TagString value={"Prince and Revolution"} />
            <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleTag>
          <SimpleTag>
            <TagName value={"Prince"} />
            <TagLanguage value={"jpn"} />
            <TagDefault value={false} />
            <TagString value={"Prince and Revolution"} />
            <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleTag>
        </Tag>
        <Tag>
          <Targets>
            <TargetTypeValue value={0x30} />
            <TargetType value={"ALBUM"} />
            <TagTrackUID value={127} />
          </Targets>
          <SimpleTag>
            <TagName value={"Prince"} />
            <TagLanguage value={"jpn"} />
            <TagDefault value={false} />
            <TagString value={"Prince and Revolution"} />
            <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleTag>
          <SimpleTag>
            <TagName value={"Prince"} />
            <TagLanguage value={"jpn"} />
            <TagDefault value={false} />
            <TagString value={"Prince and Revolution"} />
            <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleTag>
        </Tag>
      </Tags>
      <Tags>
        <Tag>
          <Targets>
            <TargetTypeValue value={0x30} />
            <TargetType value={"ALBUM"} />
            <TagTrackUID value={127} />
          </Targets>
          <SimpleTag>
            <TagName value={"Prince"} />
            <TagLanguage value={"jpn"} />
            <TagDefault value={false} />
            <TagString value={"Prince and Revolution"} />
            <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleTag>
          <SimpleTag>
            <TagName value={"Prince"} />
            <TagLanguage value={"jpn"} />
            <TagDefault value={false} />
            <TagString value={"Prince and Revolution"} />
            <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleTag>
        </Tag>
        <Tag>
          <Targets>
            <TargetTypeValue value={0x30} />
            <TargetType value={"ALBUM"} />
            <TagTrackUID value={127} />
          </Targets>
          <SimpleTag>
            <TagName value={"Prince"} />
            <TagLanguage value={"jpn"} />
            <TagDefault value={false} />
            <TagString value={"Prince and Revolution"} />
            <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleTag>
          <SimpleTag>
            <TagName value={"Prince"} />
            <TagLanguage value={"jpn"} />
            <TagDefault value={false} />
            <TagString value={"Prince and Revolution"} />
            <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleTag>
        </Tag>
      </Tags>
    </Segment>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    /*
    console.log('++++++++++');
    for (let i = 0; i < buffer.length; i++) {
      console.log(`\tbuffer[${i}]=${buffer[i]}`);
    }
    */
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
