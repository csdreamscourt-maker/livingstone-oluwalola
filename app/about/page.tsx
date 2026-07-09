import { Container, Section, Badge, Card } from '@/components/ui';
import { FounderPortrait } from '@/components/sections';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const values = [
  {
    title: 'Faith-based',
    description: 'Every model and framework for growth is sourced from eternal principles — anchored to a redemptive thought process grounded in honour for God and love for humanity.',
  },
  {
    title: 'Outlierness',
    description: 'Those who change the world don’t think like the masses. Breaking free from the less profitable conventional flow of life is a necessary edge, not a risk.',
  },
  {
    title: 'Building first, what lasts',
    description: 'A strong vision for the long run — prioritizing purposeful endurance over short-term wins, for posterity rather than a single cycle.',
  },
  {
    title: 'Character, the necessary charisma',
    description: 'Love for people, compassion for the weak, honour for all, integrity, and trustworthiness are non-negotiable emphases for purposeful living.',
  },
];

const roles = [
  { title: 'Coach', description: 'Guidance, inspiration, and motivation through storytelling and real experience.' },
  { title: 'Consultant', description: 'Solution-oriented, compassionate, forward-thinking.' },
  { title: 'Researcher', description: 'Anchored to the study of history, lesson adaptation, and a quest for pattern.' },
  { title: 'Reformer', description: 'Challenging the status quo, introducing superior models rooted in first-principles thinking.' },
  { title: 'Polymath', description: 'Engineer, theologian, mentor, preacher, author — a multifaceted approach to building lives and spaces.' },
];

export default function AboutPage() {
  return (
    <>
      <Section padding="xl">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center mb-20">
            <FounderPortrait
              src="/founder/founder-03-navy-suit-white-wall.jpg"
              alt="Livingstone Oluwalola"
              aspect="portrait"
              priority
              className="max-w-md mx-auto lg:max-w-none"
            />
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
                About Livingstone
              </span>
              <h1 className="text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-midnight-950 sm:text-3xl mb-5">
                Building systems for lasting impact
              </h1>
              <p className="text-[15px] text-gray-600 mb-4 leading-7">
                Livingstone is a mastermind who possesses extraordinary mental infrastructure, cognitive and critical thinking abilities within the intersection of faith, innovative technology, business, education and media. He has been known as a man of answers, ideas and strategies that help people become high-level achievers.
              </p>
              <p className="text-[15px] text-gray-600 leading-7">
                He has proven to be a visionary coach whose expertise excellently builds people and businesses — casting visions of what is achievable, drafting actionable plans, and inspiring his audience unto execution, walking with them through every process.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
            <Card variant="bordered" padding="lg">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Vision</span>
              <p className="mt-3 text-[15px] text-midnight-950 leading-7 font-medium">
                The LO brand exists to build leaders and institutions.
              </p>
            </Card>
            <Card variant="bordered" padding="lg">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Mission</span>
              <p className="mt-3 text-[15px] text-midnight-950 leading-7 font-medium">
                To coach and influence a generation of leaders, innovators, and changemakers by sharing models and frameworks that help them scale their personal growth and professional expertise.
              </p>
            </Card>
          </div>

          <div className="mb-20">
            <h2 className="text-xl font-semibold text-midnight-950 mb-8 sm:text-2xl">
              What anchors the work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-lg border border-midnight-950/10 bg-midnight-950/10">
              {values.map((value) => (
                <div key={value.title} className="bg-white p-6">
                  <h4 className="text-[15px] font-semibold text-midnight-950 mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-6">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center mb-20">
            <div className="order-2 lg:order-1">
              <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
                Philosophy
              </span>
              <h2 className="text-xl font-semibold text-midnight-950 mb-4 sm:text-2xl">
                Many roles, one mission
              </h2>
              <p className="text-[15px] text-gray-600 mb-6 leading-7">
                Livingstone wears many hats because of his multifaceted nature — the brand takes on several roles to facilitate the achievement of its mission.
              </p>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.title} className="flex gap-4">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-600" />
                    <p className="text-sm leading-6 text-gray-600">
                      <span className="font-semibold text-midnight-950">{role.title}.</span> {role.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <FounderPortrait
              src="/founder/founder-02-navy-arms-crossed.jpg"
              alt="Livingstone Oluwalola"
              aspect="portrait"
              eyebrow="Leadership"
              caption="Building convictions that outlast circumstance."
              className="order-1 lg:order-2 max-w-md mx-auto lg:max-w-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center mb-20">
            <FounderPortrait
              src="/founder/founder-07-sweater-side-profile.jpg"
              alt="Livingstone Oluwalola"
              aspect="portrait"
              className="max-w-md mx-auto lg:max-w-none"
            />
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
                A personal journey
              </span>
              <h2 className="text-xl font-semibold text-midnight-950 mb-4 sm:text-2xl">
                The work behind Livingstone
              </h2>
              <p className="text-[15px] text-gray-600 mb-4 leading-7">
                This work doesn&apos;t come from abstract theory. It comes from an ongoing commitment to building people, businesses, and institutional capacity — studied at the intersection of theology and technology, and wrestling honestly with questions of meaning, purpose, and impact.
              </p>
              <p className="text-[15px] text-gray-600 leading-7">
                Every framework here is meant to be tested in the crucible of real-world application, not admired from a distance.
              </p>
            </div>
          </div>

          <Card variant="bordered" padding="xl">
            <h2 className="text-xl font-semibold text-midnight-950 mb-4 sm:text-2xl">
              The ecosystem
            </h2>
            <p className="text-[15px] text-gray-600 mb-4 leading-7">
              The work operates through multiple integrated channels — from institutional development with House of Uphaz, to strategic advisory through Adjunct Corporation, publishing with Eternity Windows, and Dreamscourt&apos;s private spiritual reflection platform.
            </p>
            <p className="text-[15px] text-gray-600 leading-7">
              Whether through technology, education, advisory, or direct engagement, every initiative is grounded in the same commitment: building a world where excellence, integrity, and transformative impact are the norm rather than the exception.
            </p>
          </Card>

          <div className="mt-8 flex flex-wrap gap-2">
            {['Leadership Development', 'Institutional Transformation', 'Strategic Innovation', 'Human Potential', 'Faith Integration', 'Technology Solutions', 'Systems Thinking'].map((area) => (
              <Badge key={area} variant="outline">
                {area}
              </Badge>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="xl">
        <Container>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-midnight-950 mb-6 sm:text-2xl">
              Ready to explore our frameworks?
            </h2>
            <Link href="/frameworks" className="group inline-flex items-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800">
              Browse frameworks
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
