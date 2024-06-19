import './Editor.css'

import { useNodeViewFactory, usePluginViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/react'
import type { EditorView } from 'prosemirror-view'
import { DecorationSet } from 'prosemirror-view'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Plugin } from 'prosemirror-state'
import { createEditorView } from '../createEditorView'
import { Heading } from './Heading'
import { Paragraph } from './Paragraph'
import { Size } from './Size'
import { Hashes } from './Hashes'

export const Editor: FC = () => {
  const viewRef = useRef<EditorView>()
  const nodeViewFactory = useNodeViewFactory()
  const pluginViewFactory = usePluginViewFactory()
  const widgetViewFactory = useWidgetViewFactory()

  const editorRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element)
        return

      if (element.firstChild)
        return

      viewRef.current = createEditorView(element, {
        paragraph: nodeViewFactory({
          component: Paragraph,
          as: 'div',
          contentAs: 'p',
        }),
        heading: nodeViewFactory({
          component: Heading,
        }),
      }, [
        new Plugin({
          view: pluginViewFactory({
            component: Size,
          }),
        }),
      ])
    },
    [nodeViewFactory, pluginViewFactory],
  )

  const getHashWidget = useMemo(() => widgetViewFactory({
    as: 'i',
    component: Hashes,
  }), [widgetViewFactory])

  const decorationPlugin = useMemo(() => new Plugin({
    props: {
      decorations(state) {
        const { $from } = state.selection
        const node = $from.node()
        if (node.type.name !== 'heading')
          return DecorationSet.empty

        const widget = getHashWidget($from.before() + 1, {
          side: -1,
          level: node.attrs.level,
        })

        return DecorationSet.create(state.doc, [widget])
      },
    },
  }), [getHashWidget])

  const [enablePlugin, setEnablePlugin] = useState(true)

  /* Enable or disable the plugin based on a React state. */
  useEffect(() => {
    if (!enablePlugin) return

    const view = viewRef.current
    if (!view) return

    const { state } = view
    const newState = state.reconfigure({
      plugins: state.plugins.concat(decorationPlugin),
    })
    view.updateState(newState)
    console.log(newState.plugins.length)
  
    return () => {
      const currentState = view.state
      const newState = currentState.reconfigure({
        plugins: currentState.plugins.filter((plugin) => {
          return plugin !== decorationPlugin
        }),
      })
      view.updateState(newState)
      console.log(newState.plugins.length)
    }
  }, [enablePlugin, decorationPlugin])

  return (
    <>
      <div className="editor" ref={editorRef} />
      <button onClick={() => setEnablePlugin(en => !en)}>{ enablePlugin ? 'disable plugin' : 'enable plugin' }</button>
    </>
  )
}
