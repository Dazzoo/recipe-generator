'use client';

import React, { useState } from 'react';
import type { UserPreferences as UserPreferencesType } from '@/types';
import { Card } from '@/components/ui/shadcn/card';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select';
import { Slider } from '@/components/ui/shadcn/slider';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';

interface UserPreferencesProps {
  onPreferencesChange: (preferences: Partial<UserPreferencesType>) => void;
}

export function UserPreferences({ onPreferencesChange }: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<Partial<UserPreferencesType>>({
    dietaryRestrictions: [],
    cookingSkillLevel: 'beginner',
    cookingTimePreference: 'moderate',
    servingSize: 2,
  });

  const handleChange = (key: keyof UserPreferencesType, value: any) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    onPreferencesChange(updatedPreferences);
  };

  const dietaryRestrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Halal',
    'Kosher',
    'Pescatarian',
    'Low-Carb',
    'Keto',
    'Paleo',
    'Low-FODMAP',
    'Soy-Free',
    'Egg-Free',
    'Shellfish-Free',
    'Low-Sodium',
    'Sugar-Free',
  ];

  const handleRestrictionToggle = (restriction: string) => {
    const current = preferences.dietaryRestrictions || [];
    const updated = current.includes(restriction)
      ? current.filter((r) => r !== restriction)
      : [...current, restriction];
    handleChange('dietaryRestrictions', updated);
  };

  const removeRestriction = (restriction: string) => {
    const current = preferences.dietaryRestrictions || [];
    handleChange('dietaryRestrictions', current.filter((r) => r !== restriction));
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="text-sm font-medium mb-3 block pixel-text">Dietary Restrictions</label>
        <div className="space-y-3">
          <Select 
            onValueChange={handleRestrictionToggle}
            value=""
          >
            <SelectTrigger className="w-full pixel-select">
              <SelectValue placeholder="Add dietary restrictions" />
            </SelectTrigger>
            <SelectContent className="pixel-card">
              {dietaryRestrictions.map((restriction) => (
                <SelectItem 
                  key={restriction} 
                  value={restriction}
                  className={`pixel-text ${
                    preferences.dietaryRestrictions?.includes(restriction) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                  disabled={preferences.dietaryRestrictions?.includes(restriction)}
                >
                  {restriction}
                  {preferences.dietaryRestrictions?.includes(restriction) && ' ✓'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {preferences.dietaryRestrictions && preferences.dietaryRestrictions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {preferences.dietaryRestrictions.map((restriction) => (
                <Card
                  key={restriction}
                  className="px-2 py-1 flex items-center gap-1.5 bg-primary/10 border-primary pixel-card"
                >
                  <span className="text-xs font-medium pixel-text select-none">
                    {restriction}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRestriction(restriction)}
                    className="h-4 w-4 p-0 hover:bg-transparent cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-3 block pixel-text">Cooking Skill Level</label>
        <Select
          value={preferences.cookingSkillLevel}
          onValueChange={(value) =>
            handleChange('cookingSkillLevel', value as UserPreferencesType['cookingSkillLevel'])
          }
        >
          <SelectTrigger className="pixel-select">
            <SelectValue placeholder="Select skill level" />
          </SelectTrigger>
          <SelectContent className="pixel-card">
            <SelectItem value="beginner" className="pixel-text">Beginner</SelectItem>
            <SelectItem value="intermediate" className="pixel-text">Intermediate</SelectItem>
            <SelectItem value="advanced" className="pixel-text">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-3 block pixel-text">Cooking Time Preference</label>
        <Select
          value={preferences.cookingTimePreference}
          onValueChange={(value) =>
            handleChange('cookingTimePreference', value as UserPreferencesType['cookingTimePreference'])
          }
        >
          <SelectTrigger className="pixel-select">
            <SelectValue placeholder="Select time preference" />
          </SelectTrigger>
          <SelectContent className="pixel-card">
            <SelectItem value="quick" className="pixel-text">Quick (15-30 mins)</SelectItem>
            <SelectItem value="moderate" className="pixel-text">Moderate (30-60 mins)</SelectItem>
            <SelectItem value="extensive" className="pixel-text">Extensive (60+ mins)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className=''>
        <label className="text-sm font-medium mb-3 block pixel-text">
          Serving Size: {preferences.servingSize}
        </label>
        <div className="flex items-center gap-4">
          <Slider
            value={[preferences.servingSize || 2]}
            min={1}
            max={12}
            step={1}
            onValueChange={([value]) => handleChange('servingSize', value)}
            className="flex-1 pixel-slider"
          />
        </div>
      </div>
    </div>
  );
} 