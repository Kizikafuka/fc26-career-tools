-- ============================================================
--  SQUAD EXPORT TO CSV
--  FIFA Live Editor | Lua 5.4.6
--  Exports one team's full squad + attributes to a CSV file.
-- ============================================================

-- ── CONFIG ────────────────────────────────────────────────────
-- Set to 0 to auto-use your managed club, or hardcode a teamid
local TARGET_TEAM_ID   = 0

-- Output path (relative to game install dir, or use absolute)
-- Example absolute: "C:\\Users\\YourName\\Desktop\\squad.csv"
local OUTPUT_FILE      = "squad_export.csv"
-- ─────────────────────────────────────────────────────────────


-- Guard: Career Mode only
if not IsInCM() then
    MessageBox("Error", "This script must be run in Career Mode.")
    return
end

-- Resolve team id
if TARGET_TEAM_ID == 0 then
    local cu_rows = GetDBTableRows("career_users")
    if not cu_rows or #cu_rows == 0 then
        MessageBox("Error", "Could not read career_users table.")
        return
    end
    TARGET_TEAM_ID = tonumber(cu_rows[1]["clubteamid"]["value"])
    if not TARGET_TEAM_ID then
        MessageBox("Error", "Could not find clubteamid in career_users.")
        return
    end
end

local team_name = GetTeamName(TARGET_TEAM_ID)
Log(string.format("[SquadExport] Target team: %s (ID: %d)", team_name, TARGET_TEAM_ID))

-- ── Helper: safe field value from a DBRow ────────────────────
local function val(row, field)
    if row and row[field] then
        return tostring(row[field]["value"] or "")
    end
    return ""
end

-- ── Helper: wrap a string in quotes, escape internal quotes ──
local function csv_str(s)
    s = tostring(s or "")
    s = s:gsub('"', '""')
    return '"' .. s .. '"'
end

-- ── Step 1: Build playerid → player-row lookup (players table) ─
Log("[SquadExport] Loading players table...")
local all_players = GetDBTableRows("players")
local player_lookup = {}          -- [playerid_str] = row
for _, row in ipairs(all_players) do
    local pid = val(row, "playerid")
    if pid ~= "" then
        player_lookup[pid] = row
    end
end
Log(string.format("[SquadExport] Loaded %d player rows.", #all_players))

-- ── Step 2: Build playerid → edited names lookup ─────────────
Log("[SquadExport] Loading editedplayernames table...")
local all_names = GetDBTableRows("editedplayernames")
local name_lookup = {}            -- [playerid_str] = {firstname, surname, jerseyname}
for _, row in ipairs(all_names) do
    local pid = val(row, "playerid")
    if pid ~= "" then
        name_lookup[pid] = {
            firstname   = val(row, "firstname"),
            surname     = val(row, "surname"),
            jerseyname  = val(row, "playerjerseyname"),
        }
    end
end

-- ── Step 3: Find all playerids linked to our target team ─────
Log("[SquadExport] Loading teamplayerlinks table...")
local all_links = GetDBTableRows("teamplayerlinks")
local squad_pids = {}             -- ordered list of playerid strings

for _, link in ipairs(all_links) do
    local link_teamid = val(link, "teamid")
    if link_teamid == tostring(TARGET_TEAM_ID) then
        local pid = val(link, "playerid")
        if pid ~= "" then
            table.insert(squad_pids, pid)
        end
    end
end

Log(string.format("[SquadExport] Found %d players in squad.", #squad_pids))

if #squad_pids == 0 then
    MessageBox("Squad Export", "No players found for team: " .. team_name)
    return
end

-- ── Step 4: Build CSV ─────────────────────────────────────────
-- Headers — add/remove columns here as you like
local HEADERS = {
    "playerid",
    "known_as",
    "firstname",
    "surname",
    "jersey_name",
    "overall",
    "potential",
    "height",
    "weight",
    "birthdate",
    "nationality",
    "preferred_foot",
    "preferred_pos1",
    "preferred_pos2",
    "preferred_pos3",
    "preferred_pos4",
    "skill_moves",
    "weak_foot",
    "att_workrate",
    "def_workrate",
    "international_rep",
    "contract_until",
    -- GK attributes
    "gk_diving",
    "gk_handling",
    "gk_kicking",
    "gk_reflexes",
    "gk_speed",
    "gk_positioning",
    -- Outfield attributes
    "acceleration",
    "sprint_speed",
    "agility",
    "reactions",
    "balance",
    "jumping",
    "stamina",
    "strength",
    "aggression",
    "finishing",
    "shot_power",
    "long_shots",
    "volleys",
    "penalties",
    "vision",
    "crossing",
    "fk_accuracy",
    "short_passing",
    "long_passing",
    "curve",
    "dribbling",
    "ball_control",
    "composure",
    "interceptions",
    "heading_accuracy",
    "marking",
    "standing_tackle",
    "sliding_tackle",
    "positioning",
}

-- Map: header → players-table fieldname (where they differ)
local FIELD_MAP = {
    known_as          = nil,          -- filled via GetPlayerName()
    firstname         = nil,          -- from editedplayernames
    surname           = nil,          -- from editedplayernames
    jersey_name       = nil,          -- from editedplayernames
    overall           = "overallrating",
    potential         = "potential",
    height            = "height",
    weight            = "weight",
    birthdate         = "birthdate",
    nationality       = "nationality",
    preferred_foot    = "preferredfoot",
    preferred_pos1    = "preferredposition1",
    preferred_pos2    = "preferredposition2",
    preferred_pos3    = "preferredposition3",
    preferred_pos4    = "preferredposition4",
    skill_moves       = "skillmoves",
    weak_foot         = "weakfootabilitytypecode",
    att_workrate      = "attackingworkrate",
    def_workrate      = "defensiveworkrate",
    international_rep = "internationalrep",
    contract_until    = "contractvaliduntil",
    gk_diving         = "gkdiving",
    gk_handling       = "gkhandling",
    gk_kicking        = "gkkicking",
    gk_reflexes       = "gkreflexes",
    gk_speed          = "gkspeed",
    gk_positioning    = "gkpositioning",
    acceleration      = "acceleration",
    sprint_speed      = "sprintspeed",
    agility           = "agility",
    reactions         = "reactions",
    balance           = "balance",
    jumping           = "jumping",
    stamina           = "stamina",
    strength          = "strength",
    aggression        = "aggression",
    finishing         = "finishing",
    shot_power        = "shotpower",
    long_shots        = "longshots",
    volleys           = "volleys",
    penalties         = "penalties",
    vision            = "vision",
    crossing          = "crossing",
    fk_accuracy       = "freekickaccuracy",
    short_passing     = "shortpassing",
    long_passing      = "longpassing",
    curve             = "curve",
    dribbling         = "dribbling",
    ball_control      = "ballcontrol",
    composure         = "composure",
    interceptions     = "interceptions",
    heading_accuracy  = "headingaccuracy",
    marking           = "marking",
    standing_tackle   = "standingtackle",
    sliding_tackle    = "slidingtackle",
    positioning       = "positioning",
}

local lines = {}

-- Header row
table.insert(lines, table.concat(HEADERS, ","))

-- Data rows
for _, pid in ipairs(squad_pids) do
    local p_row  = player_lookup[pid]
    local n_data = name_lookup[pid]
    local known_as = GetPlayerName(tonumber(pid))

    local cells = {}

    for _, h in ipairs(HEADERS) do
        local cell = ""

        if h == "playerid" then
            cell = pid

        elseif h == "known_as" then
            cell = csv_str(known_as)

        elseif h == "firstname" then
            cell = csv_str(n_data and n_data.firstname or "")

        elseif h == "surname" then
            cell = csv_str(n_data and n_data.surname or "")

        elseif h == "jersey_name" then
            cell = csv_str(n_data and n_data.jerseyname or "")

        else
            local db_field = FIELD_MAP[h] or h
            cell = val(p_row, db_field)
        end

        table.insert(cells, cell)
    end

    table.insert(lines, table.concat(cells, ","))
end

-- ── Step 5: Write file ────────────────────────────────────────
local file, err = io.open(OUTPUT_FILE, "w")
if not file then
    Log("[SquadExport] ERROR opening file: " .. tostring(err))
    MessageBox("Export Failed", "Could not write to:\n" .. OUTPUT_FILE .. "\n\n" .. tostring(err))
    return
end

for _, line in ipairs(lines) do
    file:write(line .. "\n")
end
file:close()

local msg = string.format(
    "Squad exported!\n\nTeam: %s\nPlayers: %d\nFile: %s",
    team_name, #squad_pids, OUTPUT_FILE
)
Log("[SquadExport] Done. " .. msg)
MessageBox("Squad Export Complete", msg)
