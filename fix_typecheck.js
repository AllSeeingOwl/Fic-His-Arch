const fs = require('fs');

const path = 'src/components/ContributeForm.jsx';
let content = fs.readFileSync(path, 'utf8');

// fix type check errors related to checked property
content = content.replace(
  `const { name, value, type, checked } = e.target;`,
  `const target = e.target;\n    const name = target.name;\n    const value = target.value;\n    const type = target.type;\n    const checked = target.checked;`
);

fs.writeFileSync(path, content);
