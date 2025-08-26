import { Palette } from 'lucide-react';
import { Theme } from '@/types/assignment';
import { useTheme } from '@/hooks/useTheme';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const themeGroups = [
  {
    name: 'Light',
    themes: [
      { value: 'white-gold', label: 'Dawn', colors: ['#ffffff', '#f5d547'] },
      { value: 'forest', label: 'Forest', colors: ['#f1f8e9', '#10b981'] },
      { value: 'cherry', label: 'Cherry', colors: ['#fce4ec', '#ec4899'] },
    ]
  },
  {
    name: 'Dark',
    themes: [
      { value: 'ocean', label: 'Ocean', colors: ['#1a365d', '#3b82f6'] },
      { value: 'sunset', label: 'Sunset', colors: ['#1e1b4b', '#8b5cf6'] },
      { value: 'midnight', label: 'Midnight', colors: ['#111827', '#f5d547'] },
    ]
  }
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="elegant" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-foreground px-2 py-1">
            Choose Theme
          </h4>
          {themeGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center">
                <span className="mr-2 text-xs">
                  {group.name === 'Dark' ? '🌙' : '☀️'}
                </span>
                {group.name} Themes
              </div>
              <div className="grid gap-1">
                {group.themes.map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value as Theme)}
                    className={`flex items-center w-full px-2 py-1.5 text-sm rounded-md transition-colors ${
                      theme === themeOption.value
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex gap-1 mr-2">
                      {themeOption.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{themeOption.label}</span>
                    {theme === themeOption.value && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}