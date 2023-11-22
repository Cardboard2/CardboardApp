type price = {
  monthly: string,
  annually_m: string,
  annually_y: string
}

type priceId = {
  monthly: string,
  annually: string,
}

export interface tier {
  name: string,
  id: string,
  href: string,
  price: price,
  priceId?: priceId,
  description: string
  features: string[]
}

export const tiers : tier[] = [
  {
    name: '20x30 All Purpose',
    id: 'tier-pleb',
    href: '#',
    price: { monthly: 'Free', annually_m: 'Free', annually_y: 'Free' },
    description: 'Everything necessary to get started. We can be nice if we wanted to.',
    features: ['Free 15 GB storage just for you ❤️'],
  },
  {
    name: '40x60 Heavy Duty',
    id: 'tier-normal',
    href: '#',
    price: { monthly: '$1.99', annually_m: '$1.49', annually_y: '$17.99' },
    priceId: { monthly: 'price_1O95MAIEdHdbj4cnIlR0sIgM', annually: 'price_1O95TNIEdHdbj4cn850p9f5d' },
    description: 'When you need some serious storage for them 🐈‍⬛ pics.',
    features: [
      '100 GB of on-demand storage',
      'We will actually answer your emails'
    ],
  },
  {
    name: '80x120 Industrial Grade',
    id: 'tier-whale',
    href: '#',
    price: { monthly: '$5.99', annually_m: '$4.99', annually_y: '$59.99' },
    priceId: { monthly: 'price_1O98rkIEdHdbj4cndIUjsLeR', annually: 'price_1O98rkIEdHdbj4cnQRHrt7DY' },
    description: 'You are an instagram model or something, idk. You do you.',
    features: [
      'A massive 1 TB of storage',
      'You might be able to call us also'

    ],
  },
]