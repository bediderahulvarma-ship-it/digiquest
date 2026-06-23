const db = require('./database/db');

// Run a quick query verification after giving the async seeder a moment to finish
console.log('Waiting 1.5 seconds for DB initialization and seeding to complete...');

setTimeout(() => {
  console.log('\nRunning database checks...');
  db.serialize(() => {
    // 1. Verify Customers table
    db.all('SELECT * FROM customers', (err, customers) => {
      if (err) {
        console.error('FAIL: Could not query customers:', err.message);
        process.exit(1);
      }
      console.log(`SUCCESS: Customers table has ${customers.length} records:`);
      customers.forEach(c => console.log(` - ID ${c.id}: ${c.clientName} (Email: ${c.email || 'N/A'}, Phone: ${c.phone || 'N/A'})`));

      // 2. Verify Projects table
      db.all('SELECT * FROM projects', (err, projects) => {
        if (err) {
          console.error('FAIL: Could not query projects:', err.message);
          process.exit(1);
        }
        console.log(`\nSUCCESS: Projects table has ${projects.length} records:`);
        projects.forEach(p => {
          console.log(` - ID ${p.id}: "${p.projectName}" by client "${p.clientName}" | Status: [${p.status}]`);
          console.log(`   Checklist: CG=${p.colourGrading}, AM=${p.audioMix}, SUB=${p.subtitle}, FC=${p.formatConversion}, SO=${p.clientSignoff}`);
        });

        // 3. Verify Audit Logs table
        db.all('SELECT * FROM auditLogs ORDER BY id ASC', (err, logs) => {
          if (err) {
            console.error('FAIL: Could not query auditLogs:', err.message);
            process.exit(1);
          }
          console.log(`\nSUCCESS: Audit Logs table has ${logs.length} entries. Samples:`);
          logs.slice(0, 5).forEach(l => {
            console.log(` - Project ID ${l.projectId}: "${l.action}" at ${l.timestamp}`);
          });

          console.log('\n======================================');
          console.log(' DATABASE VERIFICATION COMPLETED SUCCESSFULLY! ');
          console.log('======================================');
          // Close DB connections and exit
          db.close();
        });
      });
    });
  });
}, 1500);
