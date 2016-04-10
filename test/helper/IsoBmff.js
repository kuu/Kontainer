import Kontainer from '../../src/';

const IsoBmff = Kontainer.IsoBmff;

export default {
  element:  (
    <file>
      <ftyp majorBrand="isom" />
      <moov>
        <mvhd creationTime={new Date(0)} modificationTime={new Date(0)} timeScale={1} nextTrackId={4} />
        <trak>
          <tkhd creationTime={new Date(0)} modificationTime={new Date(0)} trackId={1} width={640} height={480} />
          <mdia>
            <mdhd creationTime={new Date(0)} modificationTime={new Date(0)} timeScale={1} />
            <hdlr handlerType="video" name="avc" />
            <minf>
              <vmhd />
              <dinf>
                <dref entryCount={2}>
                  <url location="/data" />
                  <urn location="/data" name="/name" />
                </dref>
              </dinf>
              <stbl>
                <stsd entryCount={1}>
                  <avc1 dataReferenceIndex={1} width={1280} height={720}>
                    <avcC
                      avcProfileIndication="baseline"
                      profileCompatibility={{
                        constraintSet0Flag: false,
                        constraintSet1Flag: false,
                        constraintSet2Flag: false
                      }}
                      avcLevelIndication={1.3}
                      lengthSize={1}
                    />
                  </avc1>
                </stsd>
                <stts
                  entries={[
                    {sampleCount: 14, sampleDelta: 10}
                  ]}
                />
                <stsz sampleSize={5} />
                <stsc />
                <stco />
              </stbl>
            </minf>
          </mdia>
        </trak>
      </moov>
    </file>
  ),
  buffer: [
    0, 0, 0, 16, // size=16
    102, 116, 121, 112, // type='ftyp'
    105, 115, 111, 109, // major_brand='isom'
    0, 0, 0, 0, // minor_version=0
    0, 0, 2, 75, // size=587
    109, 111, 111, 118, // type='moov'
    0, 0, 0, 108, // size=108
    109, 118, 104, 100, // type='mvhd'
    0, 0, 0, 0, // version=0, flags=0
    124, 37, 176, 128, // creation_time=1970,1/1(2082844800)
    124, 37, 176, 128, // modification_time=1970,1/1(2082844800)
    0, 0, 0, 1, // timescale=1
    255, 255, 255, 255, // duration=0xFFFFFFFF(default)
    0, 1, 0, 0, // rate=1.0 !!!
    1, 0, 0, 0, // volume=1.0, reserved(16)
    0, 0, 0, 0, // reserved(32)
    0, 0, 0, 0, // reserved(32)
    0, 1, 0, 0, // matrix[0]=1.0 !!!
    0, 0, 0, 0, // matrix[1]=0
    0, 0, 0, 0, // matrix[2]=0
    0, 0, 0, 0, // matrix[3]=0
    0, 1, 0, 0, // matrix[4]=1.0 !!!
    0, 0, 0, 0, // matrix[5]=0
    0, 0, 0, 0, // matrix[6]=0
    0, 0, 0, 0, // matrix[7]=0
    64, 0, 0, 0, // matrix[8]=16384
    0, 0, 0, 0, // pre_defined(32)
    0, 0, 0, 0, // pre_defined(32)
    0, 0, 0, 0, // pre_defined(32)
    0, 0, 0, 0, // pre_defined(32)
    0, 0, 0, 0, // pre_defined(32)
    0, 0, 0, 0, // pre_defined(32)
    0, 0, 0, 4, // next_track_ID=4
    0, 0, 1, 215, // size=471
    116, 114, 97, 107, // type='trak'
    0, 0, 0, 92, // size=92
    116, 107, 104, 100, // type='tkhd'
    0, 0, 0, 3, // version=0, flags=3(default)
    124, 37, 176, 128, // creation_time=1970,1/1(2082844800)
    124, 37, 176, 128, // modification_time=1970,1/1(2082844800)
    0, 0, 0, 1, // track_ID=1
    0, 0, 0, 0, // reserved(32)
    255, 255, 255, 255, // duration=0xFFFFFFFF(default)
    0, 0, 0, 0, // reserved(32)
    0, 0, 0, 0, // reserved(32)
    0, 0, 0, 0, // layer=0, alternate_group=0
    1, 0, 0, 0, // volume=1.0, reserved(16)
    0, 1, 0, 0, // matrix[0]=1.0
    0, 0, 0, 0, // matrix[1]=0
    0, 0, 0, 0, // matrix[2]=0
    0, 0, 0, 0, // matrix[3]=0
    0, 1, 0, 0, // matrix[4]=1.0
    0, 0, 0, 0, // matrix[5]=0
    0, 0, 0, 0, // matrix[6]=0
    0, 0, 0, 0, // matrix[7]=0
    64, 0, 0, 0, // matrix[8]=16384
    2, 128, 0, 0, // width=640
    1, 224, 0, 0, // height=480
    0, 0, 1, 115, // size=371
    109, 100, 105, 97, // type='mdia'
    0, 0, 0, 32, // size=32
    109, 100, 104, 100, // type='mdhd'
    0, 0, 0, 0, // version=0, flags=0
    124, 37, 176, 128, // creation_time=1970,1/1(2082844800)
    124, 37, 176, 128, // modification_time=1970,1/1(2082844800)
    0, 0, 0, 1, // timescale=1
    255, 255, 255, 255, // duration=0xFFFFFFFF(default)
    21, 199, 0, 0, // language='eng', pre_defined(16)
    0, 0, 0, 36, // size=36
    104, 100, 108, 114, // type='hdlr'
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 0, // pre_defined(32)
    118, 105, 100, 101, // handler_type='vide'
    0, 0, 0, 0, // reserved(32)
    0, 0, 0, 0, // reserved(32)
    0, 0, 0, 0, // reserved(32)
    97, 118, 99, 0, // name='avc'
    0, 0, 1, 39, // size=295
    109, 105, 110, 102, // type='minf'
    0, 0, 0, 20, // size=20
    118, 109, 104, 100, // type='vmhd'
    0, 0, 0, 1, // version=0, flags=1
    0, 0, 0, 0, // graphicsMode='copy', opcolor.r=0
    0, 0, 0, 0, // opcolor.g=0, opcolor.b=0
    0, 0, 0, 66, // size=66
    100, 105, 110, 102, // type='dinf'
    0, 0, 0, 58, // size=58
    100, 114, 101, 102, // type='dref'
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 2, // entry_count=2
    0, 0, 0, 18, // size=18
    117, 114, 108, 32, // type='url '
    0, 0, 0, 0, // version=0, flags=0
    47, 100, 97, 116, // location='/data'
    97, 0,
    0, 0, 0, 24, // size=24
    117, 114, 110, 32, // type='urn '
    0, 0, 0, 0, // version=0, flags=0
    47, 110, 97, 109, // name='/name'
    101, 0,
    47, 100, 97, 116, // location='/data'
    97, 0,
    0, 0, 0, 201, // size=201
    115, 116, 98, 108, // type='stbl'
    0, 0, 0, 117, // size=117
    115, 116, 115, 100, // type='stsd'
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 1, // entry_count=1
    0, 0, 0, 101, // size=101
    97, 118, 99, 49, // type='avc1'
    0, 0, 0, 0, // reserved (8)[6]
    0, 0, 0, 1, // data_reference_index=1
    0, 0, 0, 0, // reserved (32)[4]
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    5, 0, 2, 208, // width=1280, height=720
    0, 72, 0, 0, // horiz_resolution=72.0dpi
    0, 72, 0, 0, // vert_resolution=72.0dpi
    0, 0, 0, 0, // reserved (32)
    0, 1, 0, 0, // frame_count=1, compressor_name string=''[32]
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 24, // depth=0x18
    255, 255, // pre_defined=-1
    0, 0, 0, 15, // size=15
    97, 118, 99, 67, // type='avcC'
    1, 66, 0, 13, // configurationVersion=1, profile='baseline', compatibility_flag=0, level=1.3
    252, 224, 0, // lengthSize=1, numOfSPS=0, npmOfPPS=0
    0, 0, 0, 24, // size=24
    115, 116, 116, 115, // type='stts'
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 1, // entry_count=1
    0, 0, 0, 14, // sample_count=14
    0, 0, 0, 10, // sample_delta=10
    0, 0, 0, 20, // size=20
    115, 116, 115, 122, // type='stsz'
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 5, // sample_size=5
    0, 0, 0, 0, // sample_count=0
    0, 0, 0, 16, // size=16
    115, 116, 115, 99, // type='stsc'
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 0, // entry_count=0
    0, 0, 0, 16, // size=16
    115, 116, 99, 111, // type='stco'
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 0 // entry_count=0
  ],
  unknownBuffer: [
    0, 0, 0, 16, // size=16
    102, 116, 121, 112, // type='ftyp'
    105, 115, 111, 109, // major_brand='isom'
    0, 0, 0, 0, // minor_version=0
    0, 0, 0, 36, // size=20
    109, 111, 111, 118, // type='moov'
    0, 0, 0, 12, // size=12
    119, 104, 97, 116, // type='what' (unknown)
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 16, // size=16
    115, 116, 99, 111, // type='stco'
    0, 0, 0, 0, // version=0, flags=0
    0, 0, 0, 0 // entry_count=0
  ]
}
