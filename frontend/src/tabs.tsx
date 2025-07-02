import { $, createContext, Observable, useContext, useMemo } from "voby"

interface TabsContext {
  selectedTab: Observable<string | undefined>
  tabsName: string
}

const tabsContext = createContext<TabsContext>()

export function Tabs({
  tabsName,
  children,
}: {
  tabsName: string
  children: JSX.Children
}): JSX.Element {
  const selectedTab = $<string>(undefined)
  // useEffect(() => {
  //   const currentTab = selectedTab()
  //   if (!currentTab) return
  //   const targetElement = document.getElementById(currentTab)
  //   if (!targetElement) return console.warn(`Tabs: No element found`)
  // })

  return (
    <tabsContext.Provider
      value={{
        selectedTab,
        tabsName,
      }}
    >
      <div class="tabs tabs-box">{children}</div>
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
      selected={isSelected}
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
  class: JSX.Class
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
