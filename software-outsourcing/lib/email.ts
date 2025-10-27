import { Resend } from 'resend'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'

export async function sendNewTaskNotification(task: any) {
  try {
    const resend = getResend()
    if (!resend) return
    await resend.emails.send({
      from: 'Platform <no-reply@yourdomain.com>',
      to: ADMIN_EMAIL,
      subject: `新任务提交：${task.title}`,
      text: JSON.stringify(task, null, 2),
    })
  } catch (err) {
    console.error('sendNewTaskNotification error:', err)
  }
}

export async function sendNewDeveloperNotification(developer: any) {
  try {
    const resend = getResend()
    if (!resend) return
    await resend.emails.send({
      from: 'Platform <no-reply@yourdomain.com>',
      to: ADMIN_EMAIL,
      subject: `新开发者提交：${developer.name}`,
      text: JSON.stringify(developer, null, 2),
    })
  } catch (err) {
    console.error('sendNewDeveloperNotification error:', err)
  }
}

export async function sendTaskApprovedEmail(task: any) {
  try {
    const resend = getResend()
    if (!resend) return
    await resend.emails.send({
      from: 'Platform <no-reply@yourdomain.com>',
      to: task.publisher_email,
      subject: '您的任务已通过审核',
      text: `任务《${task.title}》已通过审核并公开展示。`,
    })
  } catch (err) {
    console.error('sendTaskApprovedEmail error:', err)
  }
}

export async function sendTaskRejectedEmail(task: any) {
  try {
    const resend = getResend()
    if (!resend) return
    await resend.emails.send({
      from: 'Platform <no-reply@yourdomain.com>',
      to: task.publisher_email,
      subject: '您的任务未通过审核',
      text: `任务《${task.title}》未通过审核。原因：${task.reject_reason || ''}`,
    })
  } catch (err) {
    console.error('sendTaskRejectedEmail error:', err)
  }
}

export async function sendDeveloperApprovedEmail(developer: any) {
  try {
    const resend = getResend()
    if (!resend) return
    await resend.emails.send({
      from: 'Platform <no-reply@yourdomain.com>',
      to: developer.email,
      subject: '您的开发者认证已通过',
      text: `恭喜，您的开发者认证已通过！`,
    })
  } catch (err) {
    console.error('sendDeveloperApprovedEmail error:', err)
  }
}

export async function sendDeveloperRejectedEmail(developer: any) {
  try {
    const resend = getResend()
    if (!resend) return
    await resend.emails.send({
      from: 'Platform <no-reply@yourdomain.com>',
      to: developer.email,
      subject: '您的开发者认证未通过',
      text: `很抱歉，您的开发者认证未通过。原因：${developer.reject_reason || ''}`,
    })
  } catch (err) {
    console.error('sendDeveloperRejectedEmail error:', err)
  }
}

export async function sendBidSelectedEmail(bid: any) {
  try {
    const resend = getResend()
    if (!resend) return
    await resend.emails.send({
      from: 'Platform <no-reply@yourdomain.com>',
      to: bid.developer_email || 'developer@example.com',
      subject: '您的投标已被选中',
      text: `恭喜，您对任务 ${bid.task_id} 的投标已被选中！`,
    })
  } catch (err) {
    console.error('sendBidSelectedEmail error:', err)
  }
}
