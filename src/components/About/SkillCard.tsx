import type { Skill } from '../../types';

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <div className="about-feature">
      {skill.icon && <span className="about-feature-icon">{skill.icon}</span>}
      <div>
        <h4 className="about-feature-title">{skill.label}</h4>
        <p className="about-feature-desc">{skill.description}</p>
      </div>
    </div>
  );
}
