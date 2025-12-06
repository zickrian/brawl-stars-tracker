Errors
Hide
 
Resolver error at definitions.SetEsportsNotificationRequest.properties.players.$ref
Could not resolve reference: Could not resolve pointer: /definitions/List does not exist in document
Resolver error at definitions.SetEsportsNotificationResponse.properties.notification.properties.players.$ref
Could not resolve reference: Could not resolve pointer: /definitions/List does not exist in document
Resolver error at definitions.Match.properties.games.items.properties.teams.items.properties.siege.properties.botLevelByRound.$ref
Could not resolve reference: Could not resolve pointer: /definitions/List does not exist in document
Resolver error at definitions.CompletedGameList.items.properties.teams.items.properties.siege.properties.botLevelByRound.$ref
Could not resolve reference: Could not resolve pointer: /definitions/List does not exist in document
Resolver error at definitions.CompletedGame.properties.teams.items.properties.siege.properties.botLevelByRound.$ref
Could not resolve reference: Could not resolve pointer: /definitions/List does not exist in document
Resolver error at definitions.CompletedGameTeamList.items.properties.siege.properties.botLevelByRound.$ref
Could not resolve reference: Could not resolve pointer: /definitions/List does not exist in document
Resolver error at definitions.CompletedGameTeam.properties.siege.properties.botLevelByRound.$ref
Could not resolve reference: Could not resolve pointer: /definitions/List does not exist in document
Resolver error at definitions.SiegeStats.properties.botLevelByRound.$ref
Could not resolve reference: Could not resolve pointer: /definitions/List does not exist in document
 
Brawl Stars API
Brawl Stars API

Terms of service
players
Access player specific information



GET
/players/{playerTag}/battlelog
Get log of recent battles for a player.

GET
/players/{playerTag}
Get player information
clubs
Access club specific information



GET
/clubs/{clubTag}/members
List club members.

GET
/clubs/{clubTag}
Get club information.
rankings
Access global and local rankings



GET
/rankings/{countryCode}/clubs
Get club rankings for a country or global rankings.

GET
/rankings/{countryCode}/brawlers/{brawlerId}
Get brawler rankings for a country or global rankings.

GET
/rankings/{countryCode}/players
Get player rankings for a country or global rankings.
brawlers
Access general brawler information



GET
/brawlers
Get list of available brawlers.

GET
/brawlers/{brawlerId}
Get information about a brawler.
events


GET
/gamemodes
Get list of all available game modes.

GET
/events/rotation
Get event rotation

Models
PlayerRankingList[PlayerRankingList{
club	PlayerRankingClub{
name	string
}
trophies	integer
icon	PlayerIcon{
id	integer
}
tag	string
name	string
rank	integer
nameColor	string
}]
PlayerRanking{
club	PlayerRankingClub{
name	string
}
trophies	integer
icon	PlayerIcon{
id	integer
}
tag	string
name	string
rank	integer
nameColor	string
}
PlayerIcon{
id	integer
}
PlayerRankingClub{
name	string
}
ServiceVersion{
major	integer
minor	integer
content	integer
}
Brawler{
gadgets	AccessoryList[Accessory{
name	JsonLocalizedName{
}
id	integer
}]
name	JsonLocalizedName{
}
id	integer
starPowers	StarPowerList[StarPower{
name	JsonLocalizedName{
}
id	integer
}]
}
StarPowerList[StarPowerList{
name	JsonLocalizedName{
}
id	integer
}]
StarPower{
name	JsonLocalizedName{
}
id	integer
}
JsonLocalizedName{
}
AccessoryList[AccessoryList{
name	JsonLocalizedName{
}
id	integer
}]
Accessory{
name	JsonLocalizedName{
}
id	integer
}
BattleRegionList[BattleRegionList{
id	integer
name	string
}]
BattleRegion{
id	integer
name	string
}
ClubRankingList[ClubRankingList{
tag	string
name	string
trophies	integer
rank	integer
memberCount	integer
badgeId	integer
}]
ClubRanking{
tag	string
name	string
trophies	integer
rank	integer
memberCount	integer
badgeId	integer
}
RegisterMatchRequest{
mode	string
Enum:
Array [ 2 ]
players	RegisterMatchRequestPlayers[PlayerEntry{
tag	string
side	integer
}]
locationId	integer
winsRequired	integer
gadgetsAllowed	boolean
bannedBrawlers	BannedBrawlerList[BannedBrawlerEntry{
id	integer
side	integer
}]
timerPreset	string
Enum:
Array [ 3 ]
}
BannedBrawlerList[BannedBrawlerList{
id	integer
side	integer
}]
BannedBrawlerEntry{
id	integer
side	integer
}
RegisterMatchRequestPlayers[RegisterMatchRequestPlayers{
tag	string
side	integer
}]
PlayerEntry{
tag	string
side	integer
}
RegisterMatchResponse{
id	string
}
MatchLocationList[MatchLocationList{
id	integer
name	string
gameMode	string
}]
MatchLocation{
id	integer
name	string
gameMode	string
}
SetEsportsNotificationRequest{
type	string
Enum:
Array [ 2 ]
players	{
}
ttl	integer
}
SetEsportsNotificationResponse{
notification	SetEsportsNotificationRequest{
type	string
Enum:
Array [ 2 ]
players	{
}
ttl	integer
}
status	string
}
Club{
tag	string
name	string
description	string
trophies	integer
requiredTrophies	integer
members	ClubMemberList[ClubMember{
icon	PlayerIcon{
id	integer
}
tag	string
name	string
trophies	integer
role	string
Enum:
Array [ 6 ]
nameColor	string
}]
type	string
Enum:
Array [ 4 ]
badgeId	integer
}
ClubMemberList[ClubMemberList{
icon	PlayerIcon{
id	integer
}
tag	string
name	string
trophies	integer
role	string
Enum:
Array [ 6 ]
nameColor	string
}]
ClubMember{
icon	PlayerIcon{
id	integer
}
tag	string
name	string
trophies	integer
role	string
Enum:
Array [ 6 ]
nameColor	string
}
ScheduledEvents[ScheduledEvents{
slotId	integer
event	ScheduledEventLocation{
mode	string
Enum:
Array [ 39 ]
modeId	integer
modifiers	EventModifierList[string
Enum:
Array [ 18 ]
]
id	integer
map	JsonLocalizedName{
}
}
startTime	string
endTime	string
}]
ScheduledEvent{
slotId	integer
event	ScheduledEventLocation{
mode	string
Enum:
Array [ 39 ]
modeId	integer
modifiers	EventModifierList[string
Enum:
Array [ 18 ]
]
id	integer
map	JsonLocalizedName{
}
}
startTime	string
endTime	string
}
ScheduledEventLocation{
mode	string
Enum:
Array [ 39 ]
modeId	integer
modifiers	EventModifierList[string
Enum:
Array [ 18 ]
]
id	integer
map	JsonLocalizedName{
}
}
EventModifierList[string
Enum:
Array [ 18 ]
]
EventModifier{
}
Player{
club	PlayerClub{
tag	string
name	string
}
3vs3Victories	integer
isQualifiedFromChampionshipChallenge	boolean
icon	PlayerIcon{
id	integer
}
tag	string
name	string
trophies	integer
expLevel	integer
expPoints	integer
highestTrophies	integer
soloVictories	integer
duoVictories	integer
bestRoboRumbleTime	integer
bestTimeAsBigBrawler	integer
brawlers	BrawlerStatList[...]
nameColor	string
}
BrawlerStatList[BrawlerStatList{
gadgets	AccessoryList[Accessory{
name	JsonLocalizedName{
}
id	integer
}]
starPowers	StarPowerList[StarPower{
name	JsonLocalizedName{
}
id	integer
}]
currentWinStreak	integer
id	integer
rank	integer
trophies	integer
highestTrophies	integer
power	integer
gears	GearStatList[GearStat{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
maxWinStreak	integer
name	JsonLocalizedName{
}
}]
BrawlerStat{
gadgets	AccessoryList[Accessory{
name	JsonLocalizedName{
}
id	integer
}]
starPowers	StarPowerList[StarPower{
name	JsonLocalizedName{
}
id	integer
}]
currentWinStreak	integer
id	integer
rank	integer
trophies	integer
highestTrophies	integer
power	integer
gears	GearStatList[GearStat{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
maxWinStreak	integer
name	JsonLocalizedName{
}
}
GearStatList[GearStatList{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
GearStat{
name	JsonLocalizedName{
}
id	integer
level	integer
}
PlayerClub{
tag	string
name	string
}
EventTypeList[EventTypeList{
name	JsonLocalizedName{
}
id	integer
}]
EventType{
name	JsonLocalizedName{
}
id	integer
}
Match{
games	CompletedGameList[CompletedGame{
teams	CompletedGameTeamList[CompletedGameTeam{
score	integer
isWinner	boolean
siege	SiegeStats{
botDamageToBase	integer
botLevelByRound	{
}
}
players	PlayerEntryCompletedGameList[PlayerEntryCompletedGame{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
statistics	Stats{
averageLatency	integer
damageDealt	integer
healingDone	integer
damageReceived	integer
kills	integer
deaths	integer
totalDamageToSafe	integer
totalDamageToPets	integer
siegeDamageToRobot	integer
siegeBoltsCollected	integer
brawlBallGoalsScored	integer
gemGrabGemsCollected	integer
gemGrabGemsLost	integer
bountyStarsGained	integer
bountyStarsLost	integer
superUsedCount	integer
matchEndKillStreak	integer
maxKillStreak	integer
hotZoneInsideZonePercentage	integer
healingDoneToSelf	integer
healingDoneToTeamMates	integer
objectivesRecovered	integer
objectivesStolen	integer
brawlBallShotsOnGoal	integer
brawlBallShotsSaved	integer
gadgetUsedCount	integer
bountyPickedMiddleStar	boolean
}
tag	string
accountId	string
}]
}]
duration	integer
location	MatchLocation{
id	integer
name	string
gameMode	string
}
replayId	string
}]
phase	string
Enum:
Array [ 7 ]
initiativeSide	integer
round	integer
teams	MatchTeamList[MatchTeam{
players	MatchTeamPlayerList[MatchTeamPlayer{
causedTermination	boolean
tag	string
isLeader	boolean
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
}]
bans	BrawlerInfoList[BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}]
side	integer
}]
terminationReason	string
Enum:
Array [ 6 ]
players	PlayerMatchStatusList[PlayerMatchStatus{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
isInBattle	boolean
isReady	boolean
isOnline	boolean
hasJoined	boolean
tag	string
}]
state	string
Enum:
Array [ 3 ]
id	string
}
PlayerMatchStatusList[PlayerMatchStatusList{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
isInBattle	boolean
isReady	boolean
isOnline	boolean
hasJoined	boolean
tag	string
}]
PlayerMatchStatus{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
isInBattle	boolean
isReady	boolean
isOnline	boolean
hasJoined	boolean
tag	string
}
BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
GearInfoList[GearInfoList{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}
MatchTeamList[MatchTeamList{
players	MatchTeamPlayerList[MatchTeamPlayer{
causedTermination	boolean
tag	string
isLeader	boolean
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
}]
bans	BrawlerInfoList[BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}]
side	integer
}]
MatchTeam{
players	MatchTeamPlayerList[MatchTeamPlayer{
causedTermination	boolean
tag	string
isLeader	boolean
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
}]
bans	BrawlerInfoList[BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}]
side	integer
}
BrawlerInfoList[BrawlerInfoList{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}]
MatchTeamPlayerList[MatchTeamPlayerList{
causedTermination	boolean
tag	string
isLeader	boolean
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
}]
MatchTeamPlayer{
causedTermination	boolean
tag	string
isLeader	boolean
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
}
CompletedGameList[CompletedGameList{
teams	CompletedGameTeamList[CompletedGameTeam{
score	integer
isWinner	boolean
siege	SiegeStats{
botDamageToBase	integer
botLevelByRound	{
}
}
players	PlayerEntryCompletedGameList[PlayerEntryCompletedGame{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
statistics	Stats{
averageLatency	integer
damageDealt	integer
healingDone	integer
damageReceived	integer
kills	integer
deaths	integer
totalDamageToSafe	integer
totalDamageToPets	integer
siegeDamageToRobot	integer
siegeBoltsCollected	integer
brawlBallGoalsScored	integer
gemGrabGemsCollected	integer
gemGrabGemsLost	integer
bountyStarsGained	integer
bountyStarsLost	integer
superUsedCount	integer
matchEndKillStreak	integer
maxKillStreak	integer
hotZoneInsideZonePercentage	integer
healingDoneToSelf	integer
healingDoneToTeamMates	integer
objectivesRecovered	integer
objectivesStolen	integer
brawlBallShotsOnGoal	integer
brawlBallShotsSaved	integer
gadgetUsedCount	integer
bountyPickedMiddleStar	boolean
}
tag	string
accountId	string
}]
}]
duration	integer
location	MatchLocation{
id	integer
name	string
gameMode	string
}
replayId	string
}]
CompletedGame{
teams	CompletedGameTeamList[CompletedGameTeam{
score	integer
isWinner	boolean
siege	SiegeStats{
botDamageToBase	integer
botLevelByRound	{
}
}
players	PlayerEntryCompletedGameList[PlayerEntryCompletedGame{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
statistics	Stats{
averageLatency	integer
damageDealt	integer
healingDone	integer
damageReceived	integer
kills	integer
deaths	integer
totalDamageToSafe	integer
totalDamageToPets	integer
siegeDamageToRobot	integer
siegeBoltsCollected	integer
brawlBallGoalsScored	integer
gemGrabGemsCollected	integer
gemGrabGemsLost	integer
bountyStarsGained	integer
bountyStarsLost	integer
superUsedCount	integer
matchEndKillStreak	integer
maxKillStreak	integer
hotZoneInsideZonePercentage	integer
healingDoneToSelf	integer
healingDoneToTeamMates	integer
objectivesRecovered	integer
objectivesStolen	integer
brawlBallShotsOnGoal	integer
brawlBallShotsSaved	integer
gadgetUsedCount	integer
bountyPickedMiddleStar	boolean
}
tag	string
accountId	string
}]
}]
duration	integer
location	MatchLocation{
id	integer
name	string
gameMode	string
}
replayId	string
}
CompletedGameTeamList[CompletedGameTeamList{
score	integer
isWinner	boolean
siege	SiegeStats{
botDamageToBase	integer
botLevelByRound	{
}
}
players	PlayerEntryCompletedGameList[PlayerEntryCompletedGame{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
statistics	Stats{
averageLatency	integer
damageDealt	integer
healingDone	integer
damageReceived	integer
kills	integer
deaths	integer
totalDamageToSafe	integer
totalDamageToPets	integer
siegeDamageToRobot	integer
siegeBoltsCollected	integer
brawlBallGoalsScored	integer
gemGrabGemsCollected	integer
gemGrabGemsLost	integer
bountyStarsGained	integer
bountyStarsLost	integer
superUsedCount	integer
matchEndKillStreak	integer
maxKillStreak	integer
hotZoneInsideZonePercentage	integer
healingDoneToSelf	integer
healingDoneToTeamMates	integer
objectivesRecovered	integer
objectivesStolen	integer
brawlBallShotsOnGoal	integer
brawlBallShotsSaved	integer
gadgetUsedCount	integer
bountyPickedMiddleStar	boolean
}
tag	string
accountId	string
}]
}]
CompletedGameTeam{
score	integer
isWinner	boolean
siege	SiegeStats{
botDamageToBase	integer
botLevelByRound	{
}
}
players	PlayerEntryCompletedGameList[PlayerEntryCompletedGame{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
statistics	Stats{
averageLatency	integer
damageDealt	integer
healingDone	integer
damageReceived	integer
kills	integer
deaths	integer
totalDamageToSafe	integer
totalDamageToPets	integer
siegeDamageToRobot	integer
siegeBoltsCollected	integer
brawlBallGoalsScored	integer
gemGrabGemsCollected	integer
gemGrabGemsLost	integer
bountyStarsGained	integer
bountyStarsLost	integer
superUsedCount	integer
matchEndKillStreak	integer
maxKillStreak	integer
hotZoneInsideZonePercentage	integer
healingDoneToSelf	integer
healingDoneToTeamMates	integer
objectivesRecovered	integer
objectivesStolen	integer
brawlBallShotsOnGoal	integer
brawlBallShotsSaved	integer
gadgetUsedCount	integer
bountyPickedMiddleStar	boolean
}
tag	string
accountId	string
}]
}
PlayerEntryCompletedGameList[PlayerEntryCompletedGameList{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
statistics	Stats{
averageLatency	integer
damageDealt	integer
healingDone	integer
damageReceived	integer
kills	integer
deaths	integer
totalDamageToSafe	integer
totalDamageToPets	integer
siegeDamageToRobot	integer
siegeBoltsCollected	integer
brawlBallGoalsScored	integer
gemGrabGemsCollected	integer
gemGrabGemsLost	integer
bountyStarsGained	integer
bountyStarsLost	integer
superUsedCount	integer
matchEndKillStreak	integer
maxKillStreak	integer
hotZoneInsideZonePercentage	integer
healingDoneToSelf	integer
healingDoneToTeamMates	integer
objectivesRecovered	integer
objectivesStolen	integer
brawlBallShotsOnGoal	integer
brawlBallShotsSaved	integer
gadgetUsedCount	integer
bountyPickedMiddleStar	boolean
}
tag	string
accountId	string
}]
PlayerEntryCompletedGame{
brawler	BrawlerInfo{
trophyChange	integer
gears	GearInfoList[GearInfo{
name	JsonLocalizedName{
}
id	integer
level	integer
}]
trophies	integer
power	integer
starPower	StarPower{
name	JsonLocalizedName{
}
id	integer
}
gadget	Accessory{
name	JsonLocalizedName{
}
id	integer
}
name	JsonLocalizedName{
}
id	integer
}
statistics	Stats{
averageLatency	integer
damageDealt	integer
healingDone	integer
damageReceived	integer
kills	integer
deaths	integer
totalDamageToSafe	integer
totalDamageToPets	integer
siegeDamageToRobot	integer
siegeBoltsCollected	integer
brawlBallGoalsScored	integer
gemGrabGemsCollected	integer
gemGrabGemsLost	integer
bountyStarsGained	integer
bountyStarsLost	integer
superUsedCount	integer
matchEndKillStreak	integer
maxKillStreak	integer
hotZoneInsideZonePercentage	integer
healingDoneToSelf	integer
healingDoneToTeamMates	integer
objectivesRecovered	integer
objectivesStolen	integer
brawlBallShotsOnGoal	integer
brawlBallShotsSaved	integer
gadgetUsedCount	integer
bountyPickedMiddleStar	boolean
}
tag	string
accountId	string
}
Stats{
averageLatency	integer
damageDealt	integer
healingDone	integer
damageReceived	integer
kills	integer
deaths	integer
totalDamageToSafe	integer
totalDamageToPets	integer
siegeDamageToRobot	integer
siegeBoltsCollected	integer
brawlBallGoalsScored	integer
gemGrabGemsCollected	integer
gemGrabGemsLost	integer
bountyStarsGained	integer
bountyStarsLost	integer
superUsedCount	integer
matchEndKillStreak	integer
maxKillStreak	integer
hotZoneInsideZonePercentage	integer
healingDoneToSelf	integer
healingDoneToTeamMates	integer
objectivesRecovered	integer
objectivesStolen	integer
brawlBallShotsOnGoal	integer
brawlBallShotsSaved	integer
gadgetUsedCount	integer
bountyPickedMiddleStar	boolean
}
SiegeStats{
botDamageToBase	integer
botLevelByRound	{
}
}
CancelMatchResponse{
success	boolean
}
BattleList[BattleList{
battle	BattleResult{
}
battleTime	string
event	Event{
mode	string
Enum:
Array [ 39 ]
modeId	integer
id	integer
map	JsonLocalizedName{
}
}
}]
Battle{
battle	BattleResult{
}
battleTime	string
event	Event{
mode	string
Enum:
Array [ 39 ]
modeId	integer
id	integer
map	JsonLocalizedName{
}
}
}
Event{
mode	string
Enum:
Array [ 39 ]
modeId	integer
id	integer
map	JsonLocalizedName{
}
}
BattleResult{
}
BrawlerList[BrawlerList{
gadgets	AccessoryList[Accessory{
name	JsonLocalizedName{
}
id	integer
}]
name	JsonLocalizedName{
}
id	integer
starPowers	StarPowerList[StarPower{
name	JsonLocalizedName{
}
id	integer
}]
}]
ClientError{
reason	string
message	string
type	string
detail	{
}
}