use cosmwasm_std::{Addr, Binary};
use secret_toolkit::storage::{Item, Keymap};

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

pub static CONFIG: Item<State> = Item::new(b"config");
// Storage for KV.
pub static KV_MAP: Keymap<String, StorageItem> = Keymap::new(b"KV_MAP");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub gateway_address: Addr,
    pub gateway_hash: String,
    pub gateway_key: Binary,
}
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct StorageItem {
    // Value of the StorageItem  
    pub value: String,
    pub time_limit: u64,
    // ViewingKey of the StorageItem to unlock the value
    pub viewing_key: String,
    pub owner: String,
    pub viewer: String,
    pub active: bool,
}
