var Kontainer = require('..'),
    Writer = Kontainer.Writer,
    Logger = Kontainer.Logger;

class ParentBox extends Kontainer.IsoBmff.Box {

  serialize(buffer, offset) {
    var attr1 = this.props.attr1,
        attr2 = this.props.attr2,
        currentPos = offset || 0;

    currentPos += Writer.writeString(attr1, buffer, currentPos);
    currentPos += Writer.writeNumber(attr2, buffer, currentPos);

    return currentPos - offset;
  },

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
  arrt1: 'a',
  arrt2: 0
};

class ChildBox extends Kontainer.IsoBmff.Box {
  serialize(buffer, offset) {
    var attr3 = this.props.attr3;
    return Writer.writeNumber(attr3, buffer, offset);
  },

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
  Kontainer.createElement(ParentBox, {attr1: 'abc', attr2: 123},
    Kontainer.createElement(ChildBox, {attr3: 456}),
    Kontainer.createElement(ChildBox, {attr3: 789})
  )
);
