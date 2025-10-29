# Create component files
@(
    "src\components\common\Button.tsx",
    "src\components\common\Card.tsx",
    "src\components\common\LoadingSpinner.tsx",
    "src\components\common\ProgressRing.tsx",
    "src\components\common\SearchBar.tsx",
    "src\components\common\StatusIndicator.tsx",
    
    "src\components\audio\AudioPlayer.tsx",
    "src\components\audio\ProgressBar.tsx",
    "src\components\audio\PlaybackSpeedSelector.tsx",
    "src\components\audio\WordHighlighter.tsx",
    
    "src\components\navigation\SwipeGesture.tsx",
    "src\components\navigation\TabBar.tsx",
    
    "src\components\ui\Header.tsx",
    "src\components\ui\CategoryCard.tsx",
    "src\components\ui\DuaListItem.tsx",
    "src\components\ui\FilterTabs.tsx"
) | ForEach-Object { New-Item -Path $_ -ItemType File -Force }

# Create screen files
@(
    "src\screens\SplashScreen.tsx",
    "src\screens\DashboardScreen.tsx",
    "src\screens\CategoryDetailScreen.tsx",
    "src\screens\DuaAudioScreen.tsx",
    "src\screens\SearchScreen.tsx",
    "src\screens\ProgressScreen.tsx",
    "src\screens\SettingsScreen.tsx"
) | ForEach-Object { New-Item -Path $_ -ItemType File -Force }

# Create navigation files
@(
    "src\navigation\AppNavigator.tsx",
    "src\navigation\StackNavigator.tsx",
    "src\navigation\NavigationTypes.ts"
) | ForEach-Object { New-Item -Path $_ -ItemType File -Force }

# Create store files
@(
    "src\stores\duaStore.ts",
    "src\stores\audioStore.ts",
    "src\stores\settingsStore.ts",
    "src\stores\index.ts"
) | ForEach-Object { New-Item -Path $_ -ItemType File -Force }

# Create library files
@(
    "src\lib\database\database.ts",
    "src\lib\database\schema.ts",
    "src\lib\database\migrations.ts",
    "src\lib\database\seedData.ts",
    
    "src\lib\audio\AudioService.ts",
    "src\lib\audio\playbackManager.ts",
    "src\lib\audio\audioUtils.ts",
    
    "src\lib\utils\constants.ts",
    "src\lib\utils\helpers.ts",
    "src\lib\utils\formatters.ts",
    "src\lib\utils\haptics.ts",
    
    "src\lib\types\global.ts",
    "src\lib\types\database.ts",
    "src\lib\types\navigation.ts"
) | ForEach-Object { New-Item -Path $_ -ItemType File -Force }

# Create hook files
@(
    "src\hooks\useAudioPlayer.ts",
    "src\hooks\useDatabase.ts",
    "src\hooks\useSwipeGesture.ts",
    "src\hooks\useDebounce.ts",
    "src\hooks\useAppState.ts"
) | ForEach-Object { New-Item -Path $_ -ItemType File -Force }

# Create style files
@(
    "src\styles\themes.ts",
    "src\styles\colors.ts",
    "src\styles\spacing.ts",
    "src\styles\typography.ts",
    "src\styles\globalStyles.ts"
) | ForEach-Object { New-Item -Path $_ -ItemType File -Force }

# Create config files
@(
    "src\config\appConfig.ts",
    "src\config\audioConfig.ts"
) | ForEach-Object { New-Item -Path $_ -ItemType File -Force }

# Verify the structure
Write-Host "Directory structure created successfully!" -ForegroundColor Green
Get-ChildItem -Path . -Recurse -Directory | Select-Object FullName

