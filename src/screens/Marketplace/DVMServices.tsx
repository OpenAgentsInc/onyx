'use dom'

import React, { useEffect, useState } from 'react'
import { Event } from 'nostr-tools'
import Card from '@/components/Card'

interface DVMService {
  id: string
  title: string
  description: string
  pubkey: string
  created_at: number
}

interface DVMServicesProps {
  dvmManager: any // DVMManager type
}

export default function DVMServices({ dvmManager }: DVMServicesProps) {
  const [services, setServices] = useState<DVMService[]>([])

  useEffect(() => {
    if (!dvmManager) return

    const handleService = (event: Event) => {
      try {
        const service = dvmManager.parseServiceAnnouncement(event)
        setServices(prev => {
          // Deduplicate by id
          const exists = prev.find(s => s.id === service.id)
          if (exists) return prev
          return [...prev, service]
        })
      } catch (e) {
        console.error('Error parsing service:', e)
      }
    }

    const sub = dvmManager.subscribeToServices(handleService)
    return () => sub.unsub()
  }, [dvmManager])

  return (
    <Card title="DVM Services">
      <div style={$servicesContainer}>
        {services.length === 0 ? (
          <div style={$text}>Searching for DVM services...</div>
        ) : (
          services.map(service => (
            <div key={service.id} style={$serviceCard}>
              <div style={$serviceTitle}>{service.title}</div>
              <div style={$serviceDescription}>{service.description}</div>
              <div style={$serviceMeta}>
                ID: {service.id.slice(0, 8)}...
                <br />
                Pubkey: {service.pubkey.slice(0, 8)}...
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

const $servicesContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 16,
  padding: '8px 0',
}

const $text = {
  fontSize: 14,
  lineHeight: 1.5,
  color: '#fff',
  fontFamily: 'jetBrainsMonoRegular, monospace',
}

const $serviceCard = {
  padding: 16,
  backgroundColor: '#1a1a1a',
  borderRadius: 8,
  border: '1px solid #333',
}

const $serviceTitle = {
  fontSize: 16,
  fontWeight: 'bold' as const,
  color: '#fff',
  marginBottom: 8,
  fontFamily: 'jetBrainsMonoRegular, monospace',
}

const $serviceDescription = {
  fontSize: 14,
  color: '#ccc',
  marginBottom: 12,
  fontFamily: 'jetBrainsMonoRegular, monospace',
}

const $serviceMeta = {
  fontSize: 12,
  color: '#666',
  fontFamily: 'jetBrainsMonoRegular, monospace',
}