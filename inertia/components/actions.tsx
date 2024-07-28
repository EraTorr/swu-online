import type { Component } from 'solid-js'
import { createSignal, For, createEffect, Show } from 'solid-js'
import '../css/actions.scss'
import type { Card } from '../helpers/card'

export interface ActionsData {
  type: string
  area: string
  card?: Card
}

interface ActionsProps {
  data: ActionsData
  sendEvent: (e: any, value?: any) => void
}

export const Actions: Component<ActionsProps> = (props) => {
  let element!: HTMLDivElement

  const [actions, setActions] = createSignal<Array<Array<string>>>([])
  const [selected, setSelected] = createSignal<string>('')

  createEffect((prevData) => {
    if (JSON.stringify(prevData) !== JSON.stringify(props.data)) {
      actionList('prevCardtype')
    }
    return props.data
  })

  const close = () => {
    props.sendEvent('close')
  }

  const actionList = (from: any): any => {
    const actionsToSet = []
    let areaAction = props.data.area

    if (props.data.type.toLowerCase() === 'equip') {
      actionsToSet.push(['close', 'Close'])

      setActions(actionsToSet)
      return
    } else if (props.data.type.toLowerCase() === 'moveto') {
      if (props.data.card?.arenas?.includes('Space')) {
        actionsToSet.push(['to_space', 'Space'])
      } else if (props.data.card?.arenas?.includes('Ground')) {
        actionsToSet.push(['to_ground', 'Ground'])
      } else {
        actionsToSet.push(['to_space', 'Space'], ['to_ground', 'Ground'])
      }
      actionsToSet.push(
        ['to_discard', 'Discard'],
        ['to_hand', 'Hand'],
        ['to_resource', 'Resource'],
        ['to_decktop', 'Deck top'],
        ['to_deckbottom', 'Deck bottom'],
        ['close', 'Close']
      )

      setActions(actionsToSet)
      return
    }

    switch (props.data.type.toLowerCase()) {
      case 'base':
        actionsToSet.push(['changeStats', 'Change Life'], ['exhaust', 'Exhaust'])
        break
      case 'deck':
        actionsToSet.push(
          ['draw', 'Draw X'],
          ['look', 'Look X'],
          ['discardX', 'Discard X'],
          ['shuffle', 'Shuffle'],
          ['shuffleBottom', 'Shuffle X bottom']
        )
        break
      default:
        if (areaAction !== 'leader') {
          actionsToSet.push(
            ['moveto_player', 'Move to (You)'],
            ['moveto_opponent', 'Move to (Opponent)']
          )
        }
        break
    }

    switch (areaAction) {
      case 'discard':
        // actionsToSet.push(['look', 'Look'])
        break
      case 'hand':
        // actionsToSet.push(['play', 'Play'], ['reveal', 'Reveal'])
        break
      case 'leader':
        actionsToSet.push(['invoke', 'Invoke'], ['exhaust', 'Exhaust'])
        break
      case 'ground':
      case 'space':
        actionsToSet.push(
          ['changeStats', 'Stats'],
          ['exhaust', 'Exhaust'],
          ['changeShield', 'Shield'],
          ['changeExperience', 'Experience'],
          ['equip', 'Equip / Capture']
        )
        break
      case 'resource':
        actionsToSet.push(['exhaust', 'Exhaust'])
        break
    }

    actionsToSet.push(['close', 'Close'])

    setActions(actionsToSet)
  }

  const onClickAction = (e: MouseEvent, selectedAction: string) => {
    let subText = ''
    const select = selected()
    if (
      selectedAction.startsWith('moveto') ||
      ['look', 'discardX', 'draw', 'heal', 'damage'].includes(selectedAction)
    ) {
      setSelected(selectedAction)
    }
    if (select.startsWith('moveto')) {
      subText = '_' + select.split('_')[1]
      setSelected('')
    }

    props.sendEvent(selectedAction + subText)
  }

  const onClickButton = (selectedAction: string) => {
    if (selectedAction === 'changestats') {
      const hp = Number.parseInt((document.getElementById('value-hp') as HTMLInputElement).value)
      const power =
        props.data.area === 'base'
          ? 0
          : Number.parseInt((document.getElementById('value-power') as HTMLInputElement).value)
      props.sendEvent(selectedAction, { hp, power })
    } else {
      const value = Number.parseInt((document.getElementById('value') as HTMLInputElement).value)
      props.sendEvent(selectedAction, value)
    }

    setSelected('')
  }

  return (
    <div ref={element} class="action-list" classList={{ visible: !!actions().length }}>
      <ul>
        <Show
          when={
            ![
              'look',
              'discardx',
              'draw',
              'heal',
              'damage',
              'changestats',
              'changeshield',
              'changeexperience',
              'equip',
              'shufflebottom',
            ].includes(props.data.type.toLowerCase())
          }
        >
          <For each={actions()}>
            {(action) => <li onClick={(e) => onClickAction(e, action[0])}>{action[1]}</li>}
          </For>
        </Show>
        <Show
          when={[
            'look',
            'discardx',
            'draw',
            'heal',
            'damage',
            'changeshield',
            'changeexperience',
            'shufflebottom',
          ].includes(props.data.type.toLowerCase())}
        >
          <input
            id="value"
            type="number"
            min="0"
            value={
              props.data.type.toLowerCase() === 'changeshield'
                ? props.data.card?.shield
                : props.data.type.toLowerCase() === 'changeexperience'
                  ? props.data.card?.experience
                  : 1
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter') onClickButton(props.data.type.toLowerCase())
            }}
          />
          <button type="button" onClick={() => onClickButton(props.data.type.toLowerCase())}>
            {props.data.type.toLowerCase()}
          </button>
          <button type="button" onClick={() => close()}>
            Close
          </button>
        </Show>
        <Show when={props.data.type.toLowerCase() === 'changestats'}>
          <Show when={props.data.area !== 'base'}>
            <input
              id="value-power"
              class="stats power"
              type="number"
              min="0"
              value={props.data.card?.modifiedPower}
              onKeyPress={(e) => {
                if (e.key === 'Enter') onClickButton(props.data.type.toLowerCase())
              }}
            />
          </Show>
          <input
            id="value-hp"
            class="stats hp"
            type="number"
            min="0"
            value={props.data.card?.modifiedHp}
            onKeyPress={(e) => {
              if (e.key === 'Enter') onClickButton(props.data.type.toLowerCase())
            }}
          />
          <li>
            <button type="button" onClick={() => onClickButton(props.data.type.toLowerCase())}>
              Send
            </button>
          </li>
          <li>
            <button type="button" onClick={() => close()}>
              Close
            </button>
          </li>
        </Show>
        <Show when={props.data.type.toLowerCase() === 'equip'}>
          <div>Select the card to equip / capture</div>
          <For each={actions()}>
            {(action) => <li onClick={(e) => onClickAction(e, action[0])}>{action[1]}</li>}
          </For>
        </Show>
      </ul>
    </div>
  )
}
