var Kontainer = require('../../src/'),
    IsoBmff = Kontainer.IsoBmff,
    Box = IsoBmff.Box,
    Writer = Kontainer.Writer,
    Logger = Kontainer.Logger;

class ParentBox extends Box {
  constructor(props) {
    super('abcd', props);
  }

  serialize(buffer, offset=0) {
    var attr1 = this.props.attr1,
        attr2 = this.props.attr2,
        base = offset;

    if (this.type === 'uuid') {
      base += Box.UUID_HEADER_LENGTH;
    } else {
      base += Box.HEADER_LENGTH;
    }

    base += Writer.writeString(attr1, buffer, base);
    base += Writer.writeNumber(attr2, buffer, base, 4);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  dump(indent) {
    Logger.setIndent(indent || 0);
    Logger.delimiter('start');
    Logger.keyValue('attr1', this.props.attr1);
    Logger.keyValue('attr1', this.props.attr1);
    Logger.delimiter('end');
  }
}

ParentBox.propTypes = {
  arrt1: Kontainer.PropTypes.string,
  arrt2: Kontainer.PropTypes.number,
};

ParentBox.defaultProps = {
  attr1: 'a',
  attr2: 0
};

class ChildBox extends Box {
  constructor(props) {
    super('efgh', props);
  }

  serialize(buffer, offset=0) {
    var attr3 = this.props.attr3,
        base = offset;

    if (this.type === 'uuid') {
      base += Box.UUID_HEADER_LENGTH;
    } else {
      base += Box.HEADER_LENGTH;
    }

    base += Writer.writeNumber(attr3, buffer, base, 4);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  dump(indent) {
    Logger.setIndent(indent || 0);
    Logger.delimiter('start');
    Logger.keyValue('attr1', this.props.attr1);
    Logger.keyValue('attr1', this.props.attr1);
    Logger.delimiter('end');
  }
}

ChildBox.propTypes = {
  arrt3: Kontainer.PropTypes.number
};

ChildBox.defaultProps = {
  arrt3: -1
};

var buffer = Kontainer.renderToArrayBuffer(
  IsoBmff.createElement(ParentBox, {attr1: 'abc', attr2: 123},
    IsoBmff.createElement(ChildBox, {attr3: 456}),
    IsoBmff.createElement(ChildBox, {attr3: 789})
  )
);
