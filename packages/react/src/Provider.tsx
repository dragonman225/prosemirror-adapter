import type {
  FC,
  ReactNode,
} from 'react'
import React, { useMemo } from 'react'
import { createNodeViewContext } from './nodeView'
import { createPluginViewContext } from './pluginView/pluginViewContext'

import { useReactNodeViewCreator } from './nodeView/useReactNodeViewCreator'
import { useReactPluginViewCreator } from './pluginView/useReactPluginViewCreator'
import { useReactRenderer } from './ReactRenderer'
import { createWidgetViewContext } from './widgetView'
import { useReactWidgetViewCreator } from './widgetView/useReactWidgetViewCreator'

export type CreateReactNodeView = ReturnType<typeof useReactNodeViewCreator>
export type CreateReactPluginView = ReturnType<typeof useReactPluginViewCreator>
export type CreateReactWidgetView = ReturnType<typeof useReactWidgetViewCreator>

export const ProsemirrorAdapterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { renderReactRenderer, removeReactRenderer, portals } = useReactRenderer()

  const createReactNodeView: CreateReactNodeView = useReactNodeViewCreator(renderReactRenderer, removeReactRenderer)
  const createReactPluginView: CreateReactPluginView = useReactPluginViewCreator(renderReactRenderer, removeReactRenderer)
  const createReactWidgetView: CreateReactWidgetView = useReactWidgetViewCreator(renderReactRenderer, removeReactRenderer)

  const memoizedPortals = useMemo(() => Object.values(portals), [portals])

  return (
    <createNodeViewContext.Provider value={createReactNodeView}>
      <createPluginViewContext.Provider value={createReactPluginView}>
        <createWidgetViewContext.Provider value={createReactWidgetView}>
          {children}
          {memoizedPortals}
        </createWidgetViewContext.Provider>
      </createPluginViewContext.Provider>
    </createNodeViewContext.Provider>
  )
}
