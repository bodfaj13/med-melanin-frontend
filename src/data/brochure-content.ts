export interface BrochureSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'checklist' | 'warning' | 'info';
  items?: BrochureItem[];
  completed?: boolean;
  notes?: string;
}

export interface BrochureItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

export interface BrochureData {
  sections: BrochureSection[];
  userProgress: {
    completedSections: string[];
    notes: Record<string, string>;
    lastUpdated: string;
  };
}

export const brochureContent: BrochureData = {
  sections: [
    {
      id: 'what-is-myomectomy',
      title: 'What is an Abdominal Myomectomy?',
      content:
        'Surgical removal of fibroids through an abdominal incision - either up and down or bikini cut. The uterus and cervix are left in place.',
      type: 'text',
      completed: false,
      notes: '',
    },
    {
      id: 'when-used',
      title: 'When is this surgery used?',
      content: 'Treatment for disease related to the uterus while wanting to preserve fertility.',
      type: 'checklist',
      items: [
        { id: 'heavy-bleeding', text: 'Heavy vaginal bleeding due to fibroids', completed: false },
        {
          id: 'urinary-bowel',
          text: 'Urinary or bowel problems related to fibroids',
          completed: false,
        },
        { id: 'pelvic-pain', text: 'Pelvic pain related to fibroids', completed: false },
        { id: 'infertility', text: 'Infertility related to fibroids', completed: false },
      ],
      completed: false,
      notes: '',
    },
    {
      id: 'activity-restrictions',
      title: 'Activity Restrictions',
      content: 'Important restrictions to follow during your 4-6 week recovery period:',
      type: 'checklist',
      items: [
        {
          id: 'no-driving',
          text: 'No driving for 2 weeks or while taking pain medication (due to potential sudden movements)',
          completed: false,
        },
        {
          id: 'no-heavy-lifting',
          text: 'No lifting anything heavier than a gallon of milk for 4-6 weeks',
          completed: false,
        },
        {
          id: 'no-pushing',
          text: 'No pushing objects like vacuum cleaners',
          completed: false,
        },
        {
          id: 'no-vigorous-exercise',
          text: 'No vigorous exercise for 4-6 weeks',
          completed: false,
        },
        {
          id: 'no-sex',
          text: 'No sexual activity for 6 weeks',
          completed: false,
        },
        {
          id: 'no-baths',
          text: 'No baths, swimming, or hot tubs for 6 weeks',
          completed: false,
        },
        {
          id: 'no-tampons',
          text: 'No tampons or douching for 6 weeks',
          completed: false,
        },
        {
          id: 'stairs-assistance',
          text: 'Climbing stairs is permitted but may require assistance initially',
          completed: false,
        },
      ],
      completed: false,
      notes: '',
    },
    {
      id: 'pain-management',
      title: 'Pain Management',
      content: 'Guidelines for managing pain and discomfort during recovery:',
      type: 'checklist',
      items: [
        {
          id: 'take-prescribed-meds',
          text: 'Take pain medication as prescribed (do not take more frequently than instructed)',
          completed: false,
        },
        {
          id: 'stool-softener',
          text: 'Take stool softener while on narcotic pain medications (prevents constipation)',
          completed: false,
        },
        {
          id: 'nausea-medication',
          text: 'Anti-nausea medication is not typically prescribed - tell doctor if history of severe nausea',
          completed: false,
        },
        {
          id: 'energy-level',
          text: 'Expect decreased energy level - minimize strenuous activity first week',
          completed: false,
        },
        {
          id: 'gentle-walking',
          text: 'Start walking as soon as possible after surgery to help healing',
          completed: false,
        },
        {
          id: 'gradual-increase',
          text: 'Gradually increase walking distance and time',
          completed: false,
        },
      ],
      completed: false,
      notes: '',
    },
    {
      id: 'warning-signs',
      title: 'Warning Signs & Symptoms',
      content: 'Call your doctor right away if you experience any of these symptoms:',
      type: 'warning',
      items: [
        {
          id: 'fever-100-4',
          text: 'Fever over 100.4°F (38°C)',
          completed: false,
        },
        {
          id: 'heavy-bleeding-period',
          text: 'Bleeding like a menstrual period or changing a pad every hour',
          completed: false,
        },
        {
          id: 'severe-pain',
          text: 'Severe pain in abdomen or pelvis that pain medication is not helping',
          completed: false,
        },
        {
          id: 'bad-odor-discharge',
          text: 'Heavy vaginal discharge with a bad odor',
          completed: false,
        },
        {
          id: 'nausea-vomiting',
          text: 'Nausea and vomiting',
          completed: false,
        },
        {
          id: 'chest-pain-breathing',
          text: 'Chest pain or difficulty breathing',
          completed: false,
        },
        {
          id: 'incision-leak',
          text: 'Leak fluid or blood from the incision or if the incision opens',
          completed: false,
        },
        {
          id: 'leg-swelling-pain',
          text: 'Swelling, redness, or pain in your legs',
          completed: false,
        },
        {
          id: 'rash',
          text: 'Develop a rash',
          completed: false,
        },
        {
          id: 'pain-urination',
          text: 'Pain with urination',
          completed: false,
        },
      ],
      completed: false,
      notes: '',
    },
    {
      id: 'follow-up-schedule',
      title: 'Follow-up Schedule',
      content: 'Important appointments and check-ins during recovery:',
      type: 'checklist',
      items: [
        {
          id: 'post-op-appointment',
          text: 'Post-operative appointment scheduled for 4-6 weeks after surgery',
          completed: false,
        },
        {
          id: 'staples-removal',
          text: "If you have staples, they may be removed before going home, by visiting nurse, or at doctor's office",
          completed: false,
        },
        {
          id: 'hospital-stay',
          text: 'Most women spend 2 nights in hospital and go home around noon the second day',
          completed: false,
        },
        {
          id: 'transportation',
          text: 'Arrange for someone to drive you home from hospital',
          completed: false,
        },
        {
          id: 'questions-concerns',
          text: 'Contact your doctor with any questions about surgery preparation, surgery, or recovery',
          completed: false,
        },
      ],
      completed: false,
      notes: '',
    },
    {
      id: 'healing-timeline',
      title: 'General Healing Timeline',
      content: 'Expected milestones and progress throughout recovery:',
      type: 'info',
      items: [
        {
          id: 'immediate-post-op',
          text: 'Immediate post-op: Cramping, bloating, sore throat from anesthesia tube',
          completed: false,
        },
        {
          id: 'day-1-2',
          text: 'Days 1-2: Hospital stay, catheter removal, compression stockings, start walking',
          completed: false,
        },
        {
          id: 'first-week',
          text: 'First week: Minimize strenuous activity, decreased energy level, showers allowed within 24 hours',
          completed: false,
        },
        {
          id: 'weeks-2-4',
          text: 'Weeks 2-4: Gradually increase activity, return to light work, normal energy level returns',
          completed: false,
        },
        {
          id: 'weeks-4-6',
          text: 'Weeks 4-6: Return to most activities, post-op appointment, may still feel tired',
          completed: false,
        },
        {
          id: 'week-6',
          text: 'Week 6: Return to normal activities, sexual activity allowed, full exercise routine',
          completed: false,
        },
        {
          id: 'bleeding-timeline',
          text: 'Bleeding: Spotting normal, changes to brownish then yellow cream color for 4-8 weeks',
          completed: false,
        },
      ],
      completed: false,
      notes: '',
    },
    {
      id: 'incision-care',
      title: 'Caring for Your Incision',
      content: 'Important information about your surgical incision:',
      type: 'checklist',
      items: [
        {
          id: 'dissolvable-stitches',
          text: 'Incision closed with dissolvable stitches or staples',
          completed: false,
        },
        {
          id: 'staples-removal',
          text: "If staples: may be removed before discharge, by visiting nurse, or at doctor's office",
          completed: false,
        },
        {
          id: 'keep-clean-dry',
          text: 'Keep incision clean and dry',
          completed: false,
        },
        {
          id: 'showers-24-hours',
          text: 'Showers allowed within 24 hours after surgery',
          completed: false,
        },
      ],
      completed: false,
      notes: '',
    },
    {
      id: 'diet-medications',
      title: 'Diet & Medications',
      content: 'Guidelines for diet and medication management:',
      type: 'checklist',
      items: [
        {
          id: 'regular-diet',
          text: 'Continue with your regular diet',
          completed: false,
        },
        {
          id: 'bowel-prep',
          text: 'If bowel prep used before surgery, may not have bowel movement for several days',
          completed: false,
        },
        {
          id: 'pain-medication',
          text: 'Pain medication prescribed after surgery - do not take more frequently than instructed',
          completed: false,
        },
        {
          id: 'stool-softener',
          text: 'Stool softener needed while taking narcotic pain medications',
          completed: false,
        },
        {
          id: 'nausea-medication',
          text: 'Anti-nausea medication not typically prescribed - tell doctor if history of severe nausea',
          completed: false,
        },
      ],
      completed: false,
      notes: '',
    },
  ],
  userProgress: {
    completedSections: [],
    notes: {},
    lastUpdated: new Date().toISOString(),
  },
};
