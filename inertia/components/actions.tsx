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

  const [action, setAction] = createSignal<Array<Array<string>>>([])
  const [selected, setSelected] = createSignal<string>('')

  createEffect((prevData) => {
    console.log('cEA', JSON.stringify(prevData) !== JSON.stringify(props.data))
    if (JSON.stringify(prevData) !== JSON.stringify(props.data)) {
      console.log('type changed to', props.data.area)
      actionList('prevCardtype')
    }
    return props.data
  })

  const clickMouseEvent = (e: MouseEvent) => {
    console.log(e, action().length, (e.target as HTMLElement)?.closest('.action-list'))
    if (!action().length) {
      props.sendEvent('close')
      document.removeEventListener('click', clickMouseEvent)
    }
  }

  onMount(() => {
    // TODO reload action list when parent remove list of action
    document.addEventListener('click', clickMouseEvent)
  })

  const actionList = (from: any): any => {
    const action = []
    console.log('actionList', props.data.type, props.data.area, from)
    let areaAction = props.data.area

    switch (props.data.type.toLowerCase()) {
      case 'leader':
        action.push(['action', 'Action'], ['invoke', 'Invoke'])
        break
      case 'base':
        action.push(['epic', 'Epic action'], ['damage', 'Damage X'], ['heal', 'Heal X'])
        break
      case 'deck':
        action.push(
          ['draw', 'Draw X'],
          ['look', 'Look X'],
          ['discard', 'Discard X'],
          ['shuffle', 'Shuffle']
        )
        break
      case 'moveto':
        action.push(
          ['to_space', 'Space'],
          ['to_ground', 'Ground'],
          ['to_discard', 'Discard'],
          ['to_hand', 'Hand'],
          ['to_resource', 'Resource'],
          ['to_decktop', 'Deck top'],
          ['to_deckbottom', 'Deck bottom']
        )
        break
      case 'draw':
        action.push(
          ['draw_1', '1'],
          ['draw_2', '2'],
          ['draw_3', '3'],
          ['draw_4', '4'],
          ['draw_5', '5']
        )

        areaAction = ''
        break
      case 'discard':
        action.push(
          ['discard_1', '1'],
          ['discard_2', '2'],
          ['discard_3', '3'],
          ['discard_4', '4'],
          ['discard_5', '5']
        )

        areaAction = ''
        break
      case 'look':
        action.push(
          ['look_1', '1'],
          ['look_2', '2'],
          ['look_3', '3'],
          ['look_4', '4'],
          ['look_5', '5']
        )

        areaAction = ''
        break
      default:
        action.push(
          ['flip', 'Flip'],
          ['follow', 'Follow'],
          ['moveto_player', 'Move to (You)'],
          ['moveto_opponent', 'Move to (Opponent)'],
          ['move', 'Move']
        )
        break
    }

    switch (areaAction) {
      case 'discard':
        action.push(['look', 'Look'])
        break
      case 'hand':
        action.push(['play', 'Play'], ['reveal', 'Reveal'])
        break
      case 'space':
        action.push(
          ['action', 'Action'],
          ['attack', 'Attack'],
          ['changeStats', 'Change Stats'],
          ['damage', 'Damage X']
        )
        break
      case 'ground':
        action.push(
          ['action', 'Action'],
          ['attack', 'Attack'],
          ['changeStats', 'Change Stats'],
          ['damage', 'Damage X']
        )
        break
      case 'resource':
        action.push(['exhaust', 'Exhaust'])
        break
      default:
        action.push(['back', 'back'])
        break
    }

    console.log('action', action)

    setAction(action)
  }

  const onClickAction = (e: MouseEvent, action: string) => {
    let subText = ''
    const select = selected()
    if (
      action.startsWith('moveto') ||
      ['look', 'discard', 'draw', 'heal', 'damage'].includes(action)
    ) {
      setSelected(action)
    }
    if (select.startsWith('moveto')) {
      subText = '_' + select.split('_')[1]
      setSelected('')
    }

    props.sendEvent(action + subText)
  }

  const onClickButton = (action: string) => {
    const value = (document.getElementById('value') as HTMLInputElement).value
    const subText = '_' + value
    setSelected('')

    props.sendEvent(action, value)
  }

  return (
    <div ref={element} class="action-list" classList={{ visible: !!action().length }}>
      {/* <ul class="action-list"> */}
      <ul>
        <Show
          when={
            !['look', 'discard', 'draw', 'heal', 'damage'].includes(props.data.type.toLowerCase())
          }
        >
          <For each={action()}>
            {(action) => <li onClick={(e) => onClickAction(e, action[0])}>{action[1]}</li>}
          </For>
        </Show>
        <Show
          when={['look', 'discard', 'draw', 'heal', 'damage'].includes(
            props.data.type.toLowerCase()
          )}
        >
          <input id="value" />
          <button type="button" onClick={(e) => onClickButton(props.data.type.toLowerCase())}>
            {props.data.type.toLowerCase()}
          </button>
        </Show>
      </ul>
    </div>
  )
}
