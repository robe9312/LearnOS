'use client';

import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { MasteryState } from '@learnos/ontology';

interface MasteryRadarProps {
  state: MasteryState;
}

export function MasteryRadar({ state }: MasteryRadarProps) {
  const data = [
    { subject: 'Conceptual', value: state.conceptualUnderstanding * 100 },
    { subject: 'Procedural', value: state.proceduralFluency * 100 },
    { subject: 'Transfer', value: state.transferAbility * 100 },
    { subject: 'Retention', value: state.retention * 100 },
    { subject: 'Confidence', value: state.confidence * 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
          />
          <Radar
            name="Mastery"
            dataKey="value"
            stroke="#00f2ff"
            fill="#00f2ff"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
