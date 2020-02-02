import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import store from 'store'
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import Tooltip from './Tooltip'

type Props = {
  user: UserState,
};

const Tour = ({ user, router }: Props) => {
  const { data: { userId} } = user
  const { location: { pathname }} = router
  const steps = [
    {
      target: '.tour-onboarding-study',
      disableBeacon: true,
      content: 'When your classmates share things like notes, and flashcards with everyone in the course, or post questions when they need help, you can see it all here',
    },
    {
      target: '.tour-onboarding-feed',
      content: `View what your classmates have shared or the question they posted to everyone to get help with. You can earn extra points towards gifts and scholarships by helping and answering questions.`,
      disableBeacon: true,
      title: 'Feed area'
    },
    {
      target: '.tour-onboarding-leaderboard',
      disableBeacon: true,
      content: `See how many points you've earned towards getting scholarships and gifts for posting and helping with classmates questions`,
      spotlightClicks: true,
      footer: 'Click the highlighted Leaderboard button to continue',
      styles: {
        toolTipFooterMessage: {
          marginTop: 0,
          padding: '10px 25px',
          fontWeight: 600,
          fontStyle: 'italic'
        }
      }
    },
    {
      target: '.tour-onboarding-leaderboard-tuesday',
      content: 'Every month the points reset and gifts are given to students for posting and helping with questions. View points progress here.',
      disableBeacon: true,
    },
    {
      target: '.tour-onboarding-leaderboard-grand',
      disableBeacon: true,
      content: 'Get 50k points a week to earn an MVP trophy. You need 7 MVPs in a semester to qualify for national scholarships'
    },
    {
      target: '.tour-onboarding-new',
      disableBeacon: true,
      spotlightClicks: true,
      title: 'Get Started',
      content: 'To earn points towards scholarships and gifts, click this button to create posts'
    },
  ]

  const [stepIndex, setStepIndex] = useState(0)
  const [running, setRunning] = useState((store.get('TOUR') !== 'VIEWED' && store.get('ONBOARDING') === 'VIEWED'))
  const [showNext, setShowNext] = useState('')

  useEffect(() => {
    if (router && 
      router.location &&
      router.location.state &&
      router.location.state.onboardingEnd
    ) {
      setRunning(store.get('TOUR') !== 'VIEWED')
    }
  }, [router])

  const handleJoyrideCallback = data => {
    const { action, index, status, type} = data;

    if ([2].includes(index)) setShowNext('none')
    else setShowNext('')

    if (index !== 0 && EVENTS.TOUR_START === type) setStepIndex(index + 1)
    else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }
    else if (action === 'close' || [STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunning(false)
      store.set('TOUR', 'VIEWED')
    }
  }

  useEffect(() => {
    if (stepIndex === 5 && pathname !== '/leaderboard'){
      setRunning(false)
      store.set('TOUR', 'VIEWED')
    }

    if (stepIndex === 2 && pathname === '/leaderboard') {
      setRunning(false)
      setTimeout(() => {
        setStepIndex(stepIndex + 1)
        setRunning(true)
      }, 1000)
    }
  }, [stepIndex, pathname])

  if (userId === '') return null

  return (
    <Joyride
      tooltipComponent={Tooltip}
      steps={steps}
      locale={{ back: 'Back', close: 'Close', last: 'End the Tour', next: 'Next', skip: 'Skip' }}
      run={running}
      continuous
      hideBackButton
      disableCloseOnEsc
      disableOverlayClose
      disableScrolling
      callback={handleJoyrideCallback}
      stepIndex={stepIndex}
      showProgress
      styles={{
        options: {
          arrowColor: '#e3ffeb',
          backgroundColor: '#e3ffeb',
          overlayColor: 'rgba(0, 0, 0, 0.75)',
          primaryColor: '#03A9F4',
          textColor: '#004a14',
          zIndex: 1000,
        },
        spotlight: {
          border: '2px solid #2D4CE3',
        },
        buttonNext: {
          display: showNext
        },
      }}
    />
  )
}

const mapStateToProps = ({ user, router }: StoreState): {} => ({
  user,
  router,
});

export default connect(
  mapStateToProps,
)(Tour);

