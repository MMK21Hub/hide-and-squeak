import {
  $,
  createContext,
  Observable,
  useContext,
  useEffect,
  useMemo,
} from "voby"

interface TabsContext {
  selectedTab: Observable<string | undefined>
  tabsName: string
}

const tabsContext = createContext<TabsContext>()

export function Tabs({
  tabsName,
  children,
  defaultTab,
}: {
  tabsName: string
  children: JSX.Children
  defaultTab?: string
}): JSX.Element {
  const selectedTab = $<string | undefined>(defaultTab ?? undefined)
  useEffect(() => {
    selectedTab()
    window.dispatchEvent(new Event("resize"))
  })

  return (
    <tabsContext.Provider
      value={{
        selectedTab,
        tabsName,
      }}
    >
      {children}
    </tabsContext.Provider>
  )
}

export function TabButton(props: {
  for: string
  children: string
}): JSX.Element {
  const tabsData = useContext(tabsContext)
  if (!tabsData) throw new Error("`TabButton` must be used within a `Tabs`")
  const { selectedTab, tabsName } = tabsData
  const isSelected = useMemo(() => selectedTab() === props.for)
  return (
    <input
      type="radio"
      name={tabsName}
      class="tab"
      aria-label={props.children}
      checked={isSelected}
      onChange={(event) => {
        if (!(event.target instanceof HTMLInputElement)) return
        if (!event.target.checked) return
        selectedTab(props.for)
      }}
    />
  )
}

export function TabContent(props: {
  name: string
  children: JSX.Child
  class?: JSX.Class
}) {
  const tabsData = useContext(tabsContext)
  if (!tabsData) throw new Error("`TabContent` must be used within a `Tabs`")
  const { selectedTab } = tabsData
  const shouldHide = useMemo(() => selectedTab() !== props.name)
  return (
    <div
      class={[
        {
          hidden: shouldHide,
        },
        props.class,
      ]}
    >
      {props.children}
    </div>
  )
}
