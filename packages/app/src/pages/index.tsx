import {
	LandingContent,
	LandingTemplate,
} from '@composition/templates/LandingTemplate';
import { NextPage } from 'next';

const content: LandingContent = {
	navbar: {
		title: 'PhotoCompose',
		buttonText: 'Open App',
		buttonHref: '/app',
	},
	hero: {
		title: 'Master Camera Composition Instantly',
		tagline:
			'Learn, practice, and perfect photography composition techniques with interactive tools and real-time feedback.',
		buttonText: 'Start Composing',
		buttonHref: '/app',
	},
	features: {
		title: 'Features',
		items: [
			{
				id: 'rule-of-thirds',
				emoji: '📐',
				title: 'Rule of Thirds Guides',
				description:
					'Overlay grid guides to frame your shots perfectly and understand key composition principles.',
			},
			{
				id: 'real-time-feedback',
				emoji: '👀',
				title: 'Real-Time Feedback',
				description:
					'Get instant tips and suggestions to improve balance, symmetry, and focal points in your shots.',
			},
			{
				id: 'composition-examples',
				emoji: '🖼️',
				title: 'Composition Examples',
				description:
					'Explore curated examples of professional photography to learn how compositions make an impact.',
			},
			{
				id: 'privacy-first',
				emoji: '🔒',
				title: 'Privacy First',
				description:
					'All your photos and composition analyses stay in your browser. Nothing is uploaded remotely.',
			},
			{
				id: 'multi-device',
				emoji: '📱',
				title: 'Multi-Device Ready',
				description:
					'Practice and analyze compositions on desktops, tablets, or phones with responsive design.',
			},
			{
				id: 'export-results',
				emoji: '💾',
				title: 'Export Analyses',
				description:
					'Save your composition overlays, examples, or annotated photos as images or PDFs for review or sharing.',
			},
		],
	},
	cta: {
		title: 'Start Perfecting Your Photography Today',
		description:
			'Improve your composition skills quickly and interactively. No signup required.',
		buttonText: 'Open PhotoCompose',
		buttonHref: '/app',
	},
	footer: {
		name: 'PhotoCompose',
	},
};

const HomePage: NextPage = () => {
	return <LandingTemplate content={content} />;
};

export default HomePage;
