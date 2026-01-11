import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const SkillCard = ({ skill }) => (
  <li className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
    <h3 className="font-bold text-lg text-blue-600">{skill.title}</h3>
    <p className="text-gray-600 text-sm mt-2">{skill.description}</p>
    <div className="flex flex-wrap gap-1 mt-3">
      {skill.skills.map((tag, i) => (
        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {tag}
        </span>
      ))}
    </div>
    {skill.experience && (
      <p className="text-xs text-gray-400 mt-2">
        {skill.experience} años de experiencia
      </p>
    )}
  </li>
);

const Skills = () => {
  const data = useStaticQuery(graphql`
    query SkillsQuery {
      allSkillsJson {
        nodes {
          id
          title
          description
          skills
          experience
          date
        }
      }
    }
  `);

  const skills = data.allSkillsJson.nodes;

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <header className="text-center">
        <h2 className="text-3xl font-bold">Mis Habilidades</h2>
        <p className="text-gray-600">Sincronizado desde Notion</p>
      </header>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {skills.map(skill => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </ul>
    </div>
  );
};

export default Skills;
