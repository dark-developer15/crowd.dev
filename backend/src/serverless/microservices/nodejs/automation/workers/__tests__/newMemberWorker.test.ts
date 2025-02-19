import { generateUUIDv4 as uuid } from '@crowd/common'
import {
  AutomationState,
  AutomationTrigger,
  AutomationType,
  IAutomationData,
  NewMemberSettings,
  PlatformType,
} from '@crowd/types'
import { shouldProcessMember } from '../newMemberWorker'

function createAutomationData(settings: NewMemberSettings): IAutomationData {
  return {
    id: uuid(),
    name: 'Member test',
    state: AutomationState.ACTIVE,
    trigger: AutomationTrigger.NEW_MEMBER,
    settings,
    type: AutomationType.WEBHOOK,
    createdAt: new Date().toISOString(),
    tenantId: '321',
    lastExecutionAt: null,
    lastExecutionError: null,
    lastExecutionState: null,
  }
}

describe('New Member Automation Worker tests', () => {
  it('Should process a worker that matches settings', async () => {
    const automation = createAutomationData({
      platforms: [PlatformType.DISCORD],
    })

    const member = {
      id: '1234',
      username: {
        [PlatformType.DISCORD]: 'discordUsername',
      },
    }

    expect(await shouldProcessMember(member, automation)).toBeTruthy()
  })

  it("Shouldn't process a worker that does not match settings", async () => {
    const automation = createAutomationData({
      platforms: [PlatformType.DEVTO],
    })

    const member = {
      id: '1234',
      username: {
        [PlatformType.DISCORD]: 'discordUsername',
      },
    }

    expect(await shouldProcessMember(member, automation)).toBeFalsy()
  })
})
