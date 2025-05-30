'use client';

import React, { useState } from 'react';
import type { UserPreferences as UserPreferencesType } from '@/types';

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
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Dietary Restrictions
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryRestrictions.map((restriction) => (
            <label key={restriction} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.dietaryRestrictions?.includes(restriction)}
                onChange={(e) => {
                  const current = preferences.dietaryRestrictions || [];
                  const updated = e.target.checked
                    ? [...current, restriction]
                    : current.filter((r) => r !== restriction);
                  handleChange('dietaryRestrictions', updated);
                }}
                className="rounded"
              />
              <span>{restriction}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Cooking Skill Level
        </label>
        <select
          value={preferences.cookingSkillLevel}
          onChange={(e) =>
            handleChange('cookingSkillLevel', e.target.value as UserPreferencesType['cookingSkillLevel'])
          }
          className="w-full p-2 border rounded"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Cooking Time Preference
        </label>
        <select
          value={preferences.cookingTimePreference}
          onChange={(e) =>
            handleChange('cookingTimePreference', e.target.value as UserPreferencesType['cookingTimePreference'])
          }
          className="w-full p-2 border rounded"
        >
          <option value="quick">Quick (15-30 mins)</option>
          <option value="moderate">Moderate (30-60 mins)</option>
          <option value="extensive">Extensive (60+ mins)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Serving Size
        </label>
        <input
          type="number"
          min="1"
          max="12"
          value={preferences.servingSize}
          onChange={(e) => handleChange('servingSize', parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
} 