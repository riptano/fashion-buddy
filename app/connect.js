import { AstraDB } from "@datastax/astra-db-ts";
  
async function main() {
  // Initialization
  const astraDb = new AstraDB(
  "AstraCS:rfOWEadYZMemZhSODGwXlHMn:295cf2812df64d23649dd76c8972e800d7724b181198d7fc752a8093978abfa3", "https://24d224b8-f877-47b8-9747-3593210fed9e-us-east1.apps.astra.datastax.com")
}
main().catch(console.error);