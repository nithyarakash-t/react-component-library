import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import './App.scss'
import { ReleaseNotes } from './components/layout/releasenotes/Releasenotes'
import { Header } from './components/layout/header/Header'
import { Footer } from './components/layout/footer/Footer'
import { ThemeProvider } from './components/layout/themeSwitch/ThemeProvider'
import { Dropmenu, DropmenuControl, DropmenuMenu, DropmenuOption } from './components/library/components/dropmenu/Dropmenu'
import { Accordion, Collapse, CollapseContent, CollapseControl } from './components/library/components/accordion/Accordion'
import { Modal, ModalControl, ModalDialog } from './components/library/components/modal/Modal'
import { Button } from './components/library/elements/button/Button'
import { ModalContext } from './components/library/components/modal/ModalContext'
import { Flyout, FlyoutControl, FlyoutDialog } from './components/library/components/flyout/Flyout'
import { FlyoutContext } from './components/library/components/flyout/FlyoutContext'
import { TEST_OPTIONS } from './components/library/components/dropmenu/dump/testOptions'

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="app-wrapper">
          <Header/>
          <main className="app-wrap" id="main">
              <Routes>
                <Route path='/' element={
                  <div className='app-grid'>
                    <p>Filler</p>
                    <div style={{padding: '1rem 0', display: 'grid', gap: '1rem'}}>
                      <Dropmenu id='dcnldknc' label="sampdkcmdk">
                        <DropmenuControl>
                          <button type='button'>Sample Dropenu</button>
                        </DropmenuControl>
                        <DropmenuMenu>
                          {TEST_OPTIONS.map((option, index)=>{
                              return (
                                <DropmenuOption key={"djfnrkl" + index} >
                                    <button role="option" className="c-dropmenu__item" id={"dcnldknc" + "-option-" + index} >
                                      {option}
                                  </button>
                                </DropmenuOption>
                              )
                          })}
                        </DropmenuMenu>
                      </Dropmenu>

                      <Accordion
                        accordionId="nested-accordion-1"
                        customClass="example-nested-accordion"
                      >
                        <Collapse
                          collapseId="acc-nchild-1"
                          customClass="acc-child-collapse"
                        >
                          <CollapseControl>
                            Collapse 1
                          </CollapseControl>
                          <CollapseContent>
                            <div
                              style={{
                                paddingLeft: '3rem'
                              }}
                            >
                              <Accordion accordionId="nested-accordion-1-1">
                                <Collapse
                                  collapseId="acc-nchild-1-1"
                                  customClass="acc-child-collapse-nested"
                                  open
                                >
                                  <CollapseControl>
                                    Collapse 1-1
                                  </CollapseControl>
                                  <CollapseContent>
                                    Inner Child
                                  </CollapseContent>
                                </Collapse>
                              </Accordion>
                            </div>
                          </CollapseContent>
                        </Collapse>
                        <Collapse
                          collapseId="acc-nchild-2"
                          customClass="acc-child-collapse"
                          open
                        >
                          <CollapseControl>
                            Collapse 2
                          </CollapseControl>
                          <CollapseContent>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                          </CollapseContent>
                        </Collapse>
                      </Accordion>
                      
                      <Modal modalId="def-modal" >
                        <ModalControl>
                          <Button type="button">
                            Open Modal
                          </Button>
                        </ModalControl>
                        <ModalContext.Consumer>
                          {(context) => {
                                    // Alt. from claude - Use non-null assertion to tell TypeScript this won't be undefined
                                    // const { closeDialog } = context!;
                
                                    if (!context) return null;
                                    const { closeDialog, modalId } = context;
                                    return (
                                      <ModalDialog>
                                        <section className='c-modal__header'>
                                            <button type='button' className='c-modal__header-close' aria-label='close' onClick={closeDialog} ></button>
                                            <h2 className='c-modal__header-title' id={modalId + '-title'}>Sample Modal</h2>
                                        </section>
                                        <section className='c-modal__body'>
                                          Lorem Ipsum
                                        </section>
                                        <section className='c-modal__footer'>
                                          <Button type='button' aria-label='Cancel' onClick={closeDialog} >Cancel</Button>
                                          <Button type='button' aria-label='Submit' onClick={closeDialog} >Submit</Button>
                                        </section>
                                    </ModalDialog>
                                    );
                            }}
                        </ModalContext.Consumer>
                      </Modal>

                       <Flyout flyoutId="def-flyout" >
                        <FlyoutControl>
                          <Button type="button">
                            Open Flyout
                          </Button>
                        </FlyoutControl>
                        <FlyoutContext.Consumer>
                          {(context) => {                        
                                    if (!context) return null;
                                    const { closeFlyout, flyoutId } = context;
                                    return (
                                      <FlyoutDialog>
                                        <section className='c-modal__header'>
                                            <button type='button' className='c-modal__header-close' aria-label='close' onClick={closeFlyout} ></button>
                                            <h2 className='c-modal__header-title' id={flyoutId + '-title'}>Sample Modal</h2>
                                        </section>
                                        <section className='c-modal__body'>
                                          Lorem Ipsum
                                        </section>
                                        <section className='c-modal__footer'>
                                          <Button type='button' aria-label='Cancel' onClick={closeFlyout} >Cancel</Button>
                                          <Button type='button' aria-label='Submit' onClick={closeFlyout} >Submit</Button>
                                        </section>
                                    </FlyoutDialog>
                                    );
                            }}
                          </FlyoutContext.Consumer>
                      </Flyout>

                    </div>
                  </div>
                }></Route>
                <Route path='/releasenotes' element={<ReleaseNotes/>}></Route>
                <Route path='*' element={<Navigate to='/' />} />
              </Routes>
          </main>
          <Footer/>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
