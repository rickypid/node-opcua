// ----- this file has been automatically generated - do not edit
import { Variant } from "node-opcua-variant"
import { Byte, UAString } from "node-opcua-basic-types"
import { DTStructure } from "./dt_structure"
/**
 * |           |                                                  |
 * |-----------|--------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                      |
 * | nodeClass |DataType                                          |
 * | name      |RedundantServerDataType                           |
 * | isAbstract|false                                             |
 */
export interface DTRedundantServer extends DTStructure  {
  serverId: UAString; // String ns=0;i=12
  serviceLevel: Byte; // Byte ns=0;i=3
  serverState: Variant; // Variant ns=0;i=852
}