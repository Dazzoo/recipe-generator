'use client';

import React, { useState } from 'react';
import type { UserPreferences as UserPreferencesType } from '@/types';
import { Card } from '@/components/shadcn/card';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Slider } from '@/components/shadcn/slider';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";

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
        <label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Dietary Restrictions</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {dietaryRestrictions.map((restriction) => (
            <Button
              key={restriction}
              variant={preferences.dietaryRestrictions?.includes(restriction) ? "default" : "outline"}
              onClick={() => handleRestrictionToggle(restriction)}
              className="justify-start h-auto py-2 px-3 text-sm relative"
            >
              <div className="w-4 h-4 flex-shrink-0 mr-2 flex items-center justify-center">
                {preferences.dietaryRestrictions?.includes(restriction) ? (
                  <Check className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <div className="h-4 w-4 border rounded-sm" />
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate">{restriction}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{restriction}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
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
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <label className="text-base sm:text-lg font-medium pixel-text">
            Serving Size
          </label>
          <span className="text-lg sm:text-xl font-bold text-primary pixel-text">
            {preferences.servingSize}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            value={[preferences.servingSize || 2]}
            min={1}
            max={12}
            step={1}
            onValueChange={([value]) => handleChange('servingSize', value)}
            className="flex-1 h-12 sm:h-14 pixel-slider cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground pixel-text">
          <span>1</span>
          <span>12</span>
        </div>
      </div>
    </div>
  );
} 