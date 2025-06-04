'use client';

import React, { useState } from 'react';
import type { UserPreferences as UserPreferencesType } from '@/types';
import { Card } from '@/components/ui/shadcn/card';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select';
import { Slider } from '@/components/ui/shadcn/slider';
import { X, Check } from 'lucide-react';
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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block pixel-text">Dietary Restrictions</label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {dietaryRestrictions.map((restriction) => (
            <Card
              key={restriction}
              onClick={() => handleRestrictionToggle(restriction)}
              className={`px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors pixel-card ${
                preferences.dietaryRestrictions?.includes(restriction)
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-accent/50'
              }`}
            >
              <span className="text-xs font-medium pixel-text select-none">
                {restriction}
              </span>
              {preferences.dietaryRestrictions?.includes(restriction) ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" />
              )}
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block pixel-text">Cooking Skill Level</label>
        <Select
          value={preferences.cookingSkillLevel}
          onValueChange={(value) =>
            handleChange('cookingSkillLevel', value as UserPreferencesType['cookingSkillLevel'])
          }
        >
          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base pixel-select">
            <SelectValue placeholder="Select skill level" />
          </SelectTrigger>
          <SelectContent className="pixel-card">
            <SelectItem value="beginner" className="text-sm sm:text-base pixel-text">Beginner</SelectItem>
            <SelectItem value="intermediate" className="text-sm sm:text-base pixel-text">Intermediate</SelectItem>
            <SelectItem value="advanced" className="text-sm sm:text-base pixel-text">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block pixel-text">Cooking Time Preference</label>
        <Select
          value={preferences.cookingTimePreference}
          onValueChange={(value) =>
            handleChange('cookingTimePreference', value as UserPreferencesType['cookingTimePreference'])
          }
        >
          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base pixel-select">
            <SelectValue placeholder="Select time preference" />
          </SelectTrigger>
          <SelectContent className="pixel-card">
            <SelectItem value="quick" className="text-sm sm:text-base pixel-text">Quick (15-30 mins)</SelectItem>
            <SelectItem value="moderate" className="text-sm sm:text-base pixel-text">Moderate (30-60 mins)</SelectItem>
            <SelectItem value="extensive" className="text-sm sm:text-base pixel-text">Extensive (60+ mins)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block pixel-text">
          Serving Size: {preferences.servingSize}
        </label>
        <div className="flex items-center gap-4">
          <Slider
            value={[preferences.servingSize || 2]}
            min={1}
            max={12}
            step={1}
            onValueChange={([value]) => handleChange('servingSize', value)}
            className="flex-1 h-8 sm:h-10 pixel-slider"
          />
        </div>
      </div>
    </div>
  );
} 