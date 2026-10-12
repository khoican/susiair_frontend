import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StatusBadge from '~/components/common/StatusBadge.vue'

describe('StatusBadge', () => {
  it('falls back to Safe when daysRemaining is high', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { daysRemaining: 152 }
    })
    expect(wrapper.text()).toBe('Safe')
  })

  it('falls back to Soon within 30 days', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { daysRemaining: 10 }
    })
    expect(wrapper.text()).toBe('Soon')
  })

  it('falls back to Expired at or below zero', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { daysRemaining: 0 }
    })
    expect(wrapper.text()).toBe('Expired')
  })

  it('uses the explicit status and color when provided', async () => {
    const wrapper = await mountSuspended(StatusBadge, {
      props: { status: 'safe', color: '#1FBF8F' }
    })
    expect(wrapper.text()).toBe('Safe')
    expect(wrapper.attributes('style')).toContain('background')
  })
})
