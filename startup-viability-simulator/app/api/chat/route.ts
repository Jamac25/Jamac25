import { NextRequest, NextResponse } from 'next/server';

// Data categories and their required fields
const CATEGORY_REQUIREMENTS = {
  basics: {
    name: 'Perustiedot',
    requiredFields: [
      'businessIdea',
      'problemSolved',
      'targetMarket',
      'country',
      'industry',
      'stage',
      'targetCustomer',
    ],
    minAnswers: 5,
  },
  market: {
    name: 'Markkinat',
    requiredFields: [
      'marketSize',
      'competitors',
      'competitiveAdvantage',
      'marketGrowthRate',
      'marketShare',
    ],
    minAnswers: 4,
  },
  financials: {
    name: 'Talous',
    requiredFields: [
      'currentRevenue',
      'pricing',
      'costStructure',
      'cac',
      'clv',
      'monthlyExpenses',
      'fundingRaised',
    ],
    minAnswers: 5,
  },
  team: {
    name: 'Tiimi',
    requiredFields: [
      'teamSize',
      'keyRoles',
      'experience',
      'advisors',
    ],
    minAnswers: 3,
  },
  operations: {
    name: 'Operaatiot',
    requiredFields: [
      'supplyChain',
      'partners',
      'technology',
      'scalability',
    ],
    minAnswers: 3,
  },
  risks: {
    name: 'Riskit',
    requiredFields: [
      'regulatoryRisks',
      'marketRisks',
      'operationalRisks',
      'financialRisks',
    ],
    minAnswers: 3,
  },
  growth: {
    name: 'Kasvu',
    requiredFields: [
      'growthStrategy',
      'scalingPlan',
      'exitStrategy',
      'fundingNeeds',
    ],
    minAnswers: 3,
  },
};

// Smart AI interviewer
function generateAIResponse(
  category: string,
  userMessage: string,
  conversationHistory: any[],
  collectedData: any
): { message: string; isComplete: boolean; extractedData: any } {
  const categoryReq = CATEGORY_REQUIREMENTS[category as keyof typeof CATEGORY_REQUIREMENTS];
  const messageCount = conversationHistory.filter(m => m.role === 'user').length;

  // Extract data from user message
  const extractedData = extractDataFromMessage(userMessage, category);

  // Merge with existing collected data
  const updatedData = { ...collectedData, ...extractedData };

  // Check if category is complete
  const completedFields = Object.keys(updatedData).filter(key =>
    categoryReq.requiredFields.includes(key) && updatedData[key]
  ).length;

  const isComplete = completedFields >= categoryReq.minAnswers || messageCount >= 8;

  // Generate appropriate follow-up question
  let message = '';

  if (isComplete) {
    message = `✅ Erinomaista! Sain riittävästi tietoa kategoriasta "${categoryReq.name}".\n\nSiirrytään seuraavaan vaiheeseen!`;
  } else {
    message = generateFollowUpQuestion(category, updatedData, messageCount, userMessage);
  }

  return { message, isComplete, extractedData: updatedData };
}

// Extract structured data from user's natural language response
function extractDataFromMessage(message: string, category: string): any {
  const data: any = {};
  const lowerMessage = message.toLowerCase();

  if (category === 'basics') {
    // Extract business idea
    if (lowerMessage.includes('idea') || lowerMessage.includes('yritys') || lowerMessage.includes('business')) {
      data.businessIdea = message;
    }

    // Extract problem
    if (lowerMessage.includes('ongelma') || lowerMessage.includes('problem') || lowerMessage.includes('ratkai')) {
      data.problemSolved = message;
    }

    // Extract target market
    if (lowerMessage.includes('markkina') || lowerMessage.includes('kohde') || lowerMessage.includes('asiakas')) {
      data.targetCustomer = message;
    }

    // Extract country
    const africaCountries = ['nigeria', 'kenya', 'south africa', 'ghana', 'egypt', 'rwanda', 'ethiopia', 'tanzania', 'uganda', 'morocco'];
    africaCountries.forEach(country => {
      if (lowerMessage.includes(country)) {
        data.country = country.charAt(0).toUpperCase() + country.slice(1);
      }
    });

    // Extract industry
    const industries = ['fintech', 'agritech', 'healthtech', 'edtech', 'e-commerce', 'logistics', 'energy', 'saas'];
    industries.forEach(industry => {
      if (lowerMessage.includes(industry.toLowerCase())) {
        data.industry = industry;
      }
    });
  }

  if (category === 'market') {
    // Extract market size
    const marketSizeMatch = message.match(/(\d+)\s*(million|billion|miljoona|miljardi)/i);
    if (marketSizeMatch) {
      data.marketSize = `${marketSizeMatch[1]} ${marketSizeMatch[2]}`;
    }

    // Extract competitors
    if (lowerMessage.includes('kilpaili') || lowerMessage.includes('competitor')) {
      data.competitors = message;
    }

    // Extract competitive advantage
    if (lowerMessage.includes('etu') || lowerMessage.includes('erot') || lowerMessage.includes('advantage')) {
      data.competitiveAdvantage = message;
    }
  }

  if (category === 'financials') {
    // Extract revenue
    const revenueMatch = message.match(/(\d+[\d,.\s]*)\s*(€|eur|usd|\$|dollar)/i);
    if (revenueMatch) {
      data.currentRevenue = revenueMatch[0];
    }

    // Extract pricing
    if (lowerMessage.includes('hinta') || lowerMessage.includes('price') || lowerMessage.includes('€') || lowerMessage.includes('$')) {
      data.pricing = message;
    }

    // Extract costs
    if (lowerMessage.includes('kulu') || lowerMessage.includes('cost') || lowerMessage.includes('expense')) {
      data.costStructure = message;
    }
  }

  return data;
}

// Generate smart follow-up questions
function generateFollowUpQuestion(
  category: string,
  collectedData: any,
  messageCount: number,
  userMessage: string
): string {
  const categoryReq = CATEGORY_REQUIREMENTS[category as keyof typeof CATEGORY_REQUIREMENTS];

  // If answer is too short or vague, ask for clarification
  if (userMessage.length < 20 && messageCount > 1) {
    return `Voitko kertoa tarkemmin? Tarvitsen lisää yksityiskohtia voidakseni tehdä kattavan analyysin.`;
  }

  // Category-specific questions
  if (category === 'basics') {
    if (!collectedData.businessIdea) {
      return `Kerro minulle liikeideastasi tarkemmin:\n\n• Mitä tuotetta tai palvelua tarjoat?\n• Mikä ongelma se ratkaisee?\n• Kenelle se on tarkoitettu?`;
    }
    if (!collectedData.country) {
      return `Missä maassa aiot toimia? (esim. Nigeria, Kenya, Etelä-Afrikka, Ghana...)`;
    }
    if (!collectedData.industry) {
      return `Mihin toimialaan yrityksesi kuuluu? (esim. Fintech, Agritech, Healthtech, E-commerce...)`;
    }
    if (!collectedData.targetCustomer) {
      return `Kuka on tarkka kohdeasiakkaasi?\n\n• Ikä, sukupuoli, tulotaso?\n• Yritykset vai kuluttajat (B2B/B2C)?\n• Kuinka monta potentiaalista asiakasta on?`;
    }
    if (!collectedData.stage) {
      return `Missä vaiheessa yrityksesi on?\n\n• Pelkkä idea?\n• MVP rakennettu?\n• Ensimmäiset asiakkaat?\n• Kasvuvaihe?`;
    }
    return `Mikä on suurin haaste jonka ratkaiset asiakkaillesi? Anna konkreettinen esimerkki.`;
  }

  if (category === 'market') {
    if (!collectedData.marketSize) {
      return `Kuinka suuri on kokonaismarkkinasi?\n\n• TAM (Total Addressable Market)?\n• Kuinka monta potentiaalista asiakasta?\n• Mikä on markkinan arvo euroissa/dollareissa?`;
    }
    if (!collectedData.competitors) {
      return `Ketkä ovat suurimmat kilpailijasi?\n\n• Nimeä 3-5 yritystä\n• Mikä on heidän markkinaosuutensa?\n• Mitä he tekevät hyvin/huonosti?`;
    }
    if (!collectedData.competitiveAdvantage) {
      return `Mikä on kilpailuetusi?\n\n• Miksi asiakas valitsisi sinut kilpailijan sijaan?\n• Onko sinulla patentteja, ainutlaatuista teknologiaa tai dataa?\n• Mikä tekee sinusta 10x paremman kuin kilpailijat?`;
    }
    if (!collectedData.marketGrowthRate) {
      return `Kuinka nopeasti markkinasi kasvaa?\n\n• Vuosittainen kasvuvauhti %?\n• Onko kysyntä kasvussa vai laskussa?\n• Mitkä trendit vaikuttavat markkinaan?`;
    }
    return `Kuinka suuren markkinaosuuden aiot saavuttaa 3 vuoden kuluttua?`;
  }

  if (category === 'financials') {
    if (!collectedData.currentRevenue) {
      return `Mikä on nykyinen kuukausittainen liikevaihtosi?\n\n• Jos et ole aloittanut, kirjoita 0\n• Jos sinulla on asiakkaita, paljonko he maksavat?`;
    }
    if (!collectedData.pricing) {
      return `Mikä on hinnoittelumalisi?\n\n• Paljonko asiakkaat maksavat?\n• Onko kyseessä kuukausimaksu, kertamaksu vai jokin muu?\n• Kuinka monta hintatasoa on?`;
    }
    if (!collectedData.cac || !collectedData.clv) {
      return `Paljonko sinulta maksaa hankkia yksi asiakas (CAC)?\n\nJa paljonko yksi asiakas tuo tuloa koko elinkaaren aikana (CLV)?`;
    }
    if (!collectedData.monthlyExpenses) {
      return `Mitkä ovat suurimmat kuukausittaiset kulusi?\n\n• Palkat?\n• Markkinointi?\n• Teknologia/infrastruktuuri?\n• Toimisto?\n\nAnna arviot euroissa.`;
    }
    if (!collectedData.fundingRaised) {
      return `Paljonko olet kerännyt rahoitusta?\n\n• Onko kyseessä oma pääoma, sijoittajat vai laina?\n• Paljonko tarvitset lisää rahoitusta?`;
    }
    return `Mikä on tavoitteesi kannattavuuden suhteen? Milloin tavoittelet break-even:iä?`;
  }

  if (category === 'team') {
    if (!collectedData.teamSize) {
      return `Kuinka suuri tiimisi on?\n\n• Montako kokopäiväistä työntekijää?\n• Montako osa-aikaista tai freelanceria?`;
    }
    if (!collectedData.keyRoles) {
      return `Ketkä ovat avainhenkilöitä tiimissäsi?\n\n• CEO, CTO, CMO?\n• Mitä osaamista heillä on?\n• Onko joku tehnyt tätä ennenkin (serial entrepreneur)?`;
    }
    if (!collectedData.experience) {
      return `Mikä on tiimisi kokemus tältä alalta?\n\n• Onko teillä aiempaa kokemusta tästä toimialasta?\n• Onko joukossa domain experttiä?\n• Mitä relevanttia osaamista tiimiltä löytyy?`;
    }
    return `Onko teillä advisoreita tai mentoreita? Keitä ja miten he auttavat?`;
  }

  if (category === 'operations') {
    if (!collectedData.supplyChain) {
      return `Miten toimitusketjusi toimii?\n\n• Mistä hankit tuotteet/palvelut?\n• Onko sinulla luotettavat toimittajat?\n• Mitkä ovat suurimmat operatiiviset riskit?`;
    }
    if (!collectedData.technology) {
      return `Mitä teknologiaa käytät?\n\n• Omat palvelimet vai pilvipalvelu?\n• Mitä ohjelmistoja/työkaluja?\n• Onko teknologia skaalautuva?`;
    }
    if (!collectedData.scalability) {
      return `Miten skaalaat liiketoimintaa?\n\n• Voitko palvella 10x enemmän asiakkaita ilman 10x kustannuksia?\n• Mitkä ovat pullonkaulat kasvussa?\n• Miten automatisoit prosesseja?`;
    }
    return `Onko sinulla strategisia kumppaneita? Keitä ja miksi he ovat tärkeitä?`;
  }

  if (category === 'risks') {
    if (!collectedData.regulatoryRisks) {
      return `Mitä sääntelyyn liittyviä riskejä yrityksesi kohtaa?\n\n• Tarvitaanko lupia tai lisenssejä?\n• Onko toimialasi tiukasti säännelty?\n• Mitkä lait vaikuttavat toimintaasi?`;
    }
    if (!collectedData.marketRisks) {
      return `Mitkä ovat suurimmat markkinariskit?\n\n• Mitä jos kilpailija kopioi ideasi?\n• Mitä jos kysyntä laskee?\n• Mitä jos valuuttakurssi muuttuu?`;
    }
    if (!collectedData.operationalRisks) {
      return `Mitkä operatiiviset asiat voivat mennä pieleen?\n\n• Toimittajan konkurssi?\n• Avainhenkilön lähtö?\n• Tekninen vika?\n\nMiten hallitset nämä riskit?`;
    }
    return `Mitkä ovat suurimmat taloudelliset riskit? Miten suojaudut niitä vastaan?`;
  }

  if (category === 'growth') {
    if (!collectedData.growthStrategy) {
      return `Mikä on kasvustrategiasi?\n\n• Miten hankit uusia asiakkaita?\n• Mitkä ovat pääasialliset markkinointikanavat?\n• Mikä on go-to-market strategia?`;
    }
    if (!collectedData.scalingPlan) {
      return `Miten skaalaat yritystä seuraavien 3 vuoden aikana?\n\n• Laajenetko uusille markkinoille?\n• Rekrytoidaanko lisää henkilöstöä?\n• Kasvaako tuotevalikoima?`;
    }
    if (!collectedData.exitStrategy) {
      return `Mikä on exit-strategiasi?\n\n• Tavoitteletko yrityskauppaa (acquisition)?\n• IPO:ta?\n• Rakennatko pitkäaikaista liiketoimintaa?\n• Mikä on tavoitearvo 5-10 vuoden päästä?`;
    }
    return `Paljonko rahoitusta tarvitset seuraavaan kasvuvaiheeseen ja mihin käytät sen?`;
  }

  return `Kerro lisää. Mitä muuta minun pitäisi tietää kategoriasta "${categoryReq.name}"?`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, category, conversationHistory, collectedData } = body;

    if (!message || !category) {
      return NextResponse.json(
        { error: 'Message and category are required' },
        { status: 400 }
      );
    }

    // Generate AI response
    const response = generateAIResponse(
      category,
      message,
      conversationHistory || [],
      collectedData || {}
    );

    return NextResponse.json({
      message: response.message,
      isComplete: response.isComplete,
      extractedData: response.extractedData,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
