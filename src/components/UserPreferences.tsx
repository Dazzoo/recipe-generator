'use client';

import React, { useState } from 'react';
import type { UserPreferences as UserPreferencesType } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Check } from 'lucide-react';
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

  const handleChange = (key: keyof UserPreferencesType, value: string | number | string[] | undefined) => {
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
              className={`justify-start h-auto py-2 px-3 text-sm relative bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer ${
                preferences.dietaryRestrictions?.includes(restriction) 
                  ? 'bg-primary text-white dark:bg-primary/90 dark:text-white hover:bg-primary/90 dark:hover:bg-primary/80' 
                  : ''
              }`}
            >
              <div className="w-4 h-4 flex-shrink-0 mr-2 flex items-center justify-center">
                {preferences.dietaryRestrictions?.includes(restriction) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <div className="h-4 w-4 border rounded-sm border-gray-300 dark:border-gray-700" />
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
        <label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Cooking Skill Level</label>
        <Select
          value={preferences.cookingSkillLevel}
          onValueChange={(value) =>
            handleChange('cookingSkillLevel', value as UserPreferencesType['cookingSkillLevel'])
          }
        >
          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base bg-white dark:bg-gray-950 w-full cursor-pointer">
            <SelectValue placeholder="Select skill level" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-950 [&_[data-state=checked]]:bg-primary [&_[data-state=checked]]:text-white [&_[data-state=checked]]:dark:bg-primary/90 [&_[data-state=checked]]:dark:text-white [&_[data-state=checked]]:hover:bg-primary/90 [&_[data-state=checked]]:dark:hover:bg-primary/80 [&_[data-state=unchecked]]:hover:bg-gray-100 [&_[data-state=unchecked]]:dark:hover:bg-gray-900">
            <SelectItem value="beginner" className="text-sm sm:text-base">
              Beginner
            </SelectItem>
            <SelectItem value="intermediate" className="text-sm sm:text-base">
              Intermediate
            </SelectItem>
            <SelectItem value="advanced" className="text-sm sm:text-base">
              Advanced
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Cooking Time Preference</label>
        <Select
          value={preferences.cookingTimePreference}
          onValueChange={(value) =>
            handleChange('cookingTimePreference', value as UserPreferencesType['cookingTimePreference'])
          }
        >
          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base bg-white dark:bg-gray-950 w-full cursor-pointer">
            <SelectValue placeholder="Select time preference" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-950 [&_[data-state=checked]]:bg-primary [&_[data-state=checked]]:text-white [&_[data-state=checked]]:dark:bg-primary/90 [&_[data-state=checked]]:dark:text-white [&_[data-state=checked]]:hover:bg-primary/90 [&_[data-state=checked]]:dark:hover:bg-primary/80 [&_[data-state=unchecked]]:hover:bg-gray-100 [&_[data-state=unchecked]]:dark:hover:bg-gray-900">
            <SelectItem value="quick" className="text-sm sm:text-base">
              Quick (15-30 mins)
            </SelectItem>
            <SelectItem value="moderate" className="text-sm sm:text-base">
              Moderate (30-60 mins)
            </SelectItem>
            <SelectItem value="extensive" className="text-sm sm:text-base">
              Extensive (60+ mins)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <label className="text-sm sm:text-base font-medium">
            Serving Size
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              if (preferences.servingSize && preferences.servingSize > 1) {
                handleChange('servingSize', preferences.servingSize - 1);
              }
            }}
            className="h-10 w-10 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
          >
            -
          </Button>
          <div className="flex-1 text-center">
            <span className="text-2xl font-medium">{preferences.servingSize}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              if (preferences.servingSize && preferences.servingSize < 12) {
                handleChange('servingSize', preferences.servingSize + 1);
              }
            }}
            className="h-10 w-10 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
} 