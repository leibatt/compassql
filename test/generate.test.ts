import {assert} from 'chai';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {initEnumJobs} from '../src/generate';
import {Property} from '../src/property';
import {Schema} from '../src/schema';
import {DEFAULT_QUERY_CONFIG, SHORT_ENUM_SPEC, SpecQuery} from '../src/query';
import {duplicate} from '../src/util';


describe('generate', function () {
  describe('initEnumJobs', () => {
    const schema = new Schema([]);

    // Mark
    it('should have mark job if mark is a ShortEnumSpec.', () => {
      const specQ: SpecQuery = {
        mark: SHORT_ENUM_SPEC,
        encodings: []
      };
      const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
      assert.isTrue(enumJob.mark);
    });

    it('should have mark job if mark is an EnumSpec.', () => {
      const specQ: SpecQuery = {
        mark: {
          enumValues: [Mark.BAR]
        },
        encodings: []
      };
      const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
      assert.isTrue(enumJob.mark);
    });

    it('should have no mark job if mark is specific.', () => {
      const specQ: SpecQuery = {
        mark: Mark.BAR,
        encodings: []
      };
      const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
      assert.isNotOk(enumJob.mark);
    });

    // TODO: Transform

    // Encoding
    const encodingproperties = [Property.AGGREGATE, Property.BIN,
      Property.CHANNEL, Property.TIMEUNIT, Property.FIELD];

    // TODO: also test type

    const templateSpecQ: SpecQuery = {
      mark: Mark.POINT,
      encodings: [
        {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
      ]
    };

    encodingproperties.forEach((property) => {
      it('should have ' + property + ' job if ' + property + ' is a ShortEnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a short enum spec
        specQ.encodings[0][property] = SHORT_ENUM_SPEC;

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isOk(enumJob[property]);
      });

      it('should have ' + property + ' job if ' + property + ' is an EnumSpec.', () => {
        let specQ = duplicate(templateSpecQ);
        // set to a full enum spec
        const enumValues = property === Property.FIELD ? ['A', 'B'] : DEFAULT_QUERY_CONFIG[property +'s'];
        specQ.encodings[0][property] = {
          enumValues: enumValues
        };

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isOk(enumJob[property]);
      });

      it('should have ' + property + ' job if ' + property + ' is specific.', () => {
        let specQ = duplicate(templateSpecQ);
        // do not set to enum spec = make it specific

        const enumJob = initEnumJobs(specQ, schema, DEFAULT_QUERY_CONFIG);
        assert.isNotOk(enumJob[property]);
      });
    });
  });
});
