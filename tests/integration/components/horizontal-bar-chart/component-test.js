import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('horizontal-bar-chart', 'Integration | Component | horizontal bar chart', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{horizontal-bar-chart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#horizontal-bar-chart}}
      template block text
    {{/horizontal-bar-chart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
