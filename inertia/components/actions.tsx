import type { Component } from 'solid-js'
import { mergeProps, createSignal, onMount, For, createEffect, Show } from 'solid-js'
import { GameCard } from './game_card.jsx'
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
    console.log('cEA', JSON.stringify(prevData) !== JSON.stringify(props.data))
    if (JSON.stringify(prevData) !== JSON.stringify(props.data)) {
      console.log('type changed to', props.data.area)
      actionList('prevCardtype')
    }
    return props.data
  })

  // const clickMouseEvent = (e: MouseEvent) => {
  //   console.log(e, actions().length, (e.target as HTMLElement)?.closest('.action-list'))
  //   if (!actions().length && (e.target as HTMLElement)?.closest('.action-list')) {
  //     props.sendEvent('close')
  //     document.removeEventListener('click', clickMouseEvent)
  //   }
  // }

  const close = () => {
    props.sendEvent('close')
    // document.removeEventListener('click', clickMouseEvent)
  }

  onMount(() => {
    // TODO reload action list when parent remove list of action
    // document.addEventListener('click', clickMouseEvent)
  })

  const actionList = (from: any): any => {
    const actionsToSet = []
    console.log('actionList', props.data.type, props.data.area, from)
    let areaAction = props.data.area

    switch (props.data.type.toLowerCase()) {
      case 'leader':
        actionsToSet.push(
          ['flip', 'Flip'],
          ['invoke', 'Invoke'],
          ['exhaust', 'Exhaust'],
          ['discard', 'Discard']
        )
        break
      case 'base':
        actionsToSet.push(['changeStats', 'Change Life'], ['exhaust', 'Exhaust'])
        break
      case 'deck':
        actionsToSet.push(
          ['draw', 'Draw X'],
          ['look', 'Look X'],
          ['discard', 'Discard X'],
          ['shuffle', 'Shuffle']
        )
        break
      case 'moveto':
        actionsToSet.push(
          ['to_space', 'Space'],
          ['to_ground', 'Ground'],
          ['to_discard', 'Discard'],
          ['to_hand', 'Hand'],
          ['to_resource', 'Resource'],
          ['to_decktop', 'Deck top'],
          ['to_deckbottom', 'Deck bottom']
        )
        break
      default:
        actionsToSet.push(
          ['moveto_player', 'Move to (You)'],
          ['moveto_opponent', 'Move to (Opponent)']
        )
        break
    }

    switch (areaAction) {
      case 'discard':
        actionsToSet.push(['look', 'Look'])
        break
      case 'hand':
        actionsToSet.push(['play', 'Play'], ['reveal', 'Reveal'])
        break
      case 'ground':
      case 'space':
        actionsToSet.push(
          ['action', 'Action'],
          ['attack', 'Attack'],
          ['changeStats', 'Stats'],
          ['exhaust', 'Exhaust'],
          ['changeShield', 'Shield'],
          ['changeExperience', 'Experience']
        )
        break
      case 'resource':
        actionsToSet.push(['reveal', 'Reveal'], ['exhaust', 'Exhaust'])
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
      ['look', 'discard', 'draw', 'heal', 'damage'].includes(selectedAction)
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
    console.log('click', selectedAction, props.data.area)
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
              'discard',
              'draw',
              'heal',
              'damage',
              'changestats',
              'changeshield',
              'changeexperience',
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
            'discard',
            'draw',
            'heal',
            'damage',
            'changeshield',
            'changeexperience',
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
          <button type="button" onClick={() => onClickButton(props.data.type.toLowerCase())}>
            Send
          </button>
          <button type="button" onClick={() => close()}>
            Close
          </button>
        </Show>
      </ul>
    </div>
  )
}
