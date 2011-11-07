sys = require "sys"

module.exports = (robot) ->
    brain = robot.brain

    robot.enter (msg) ->
        # console.log msg


    robot.hear /^register ([-_a-z0-9\.\+]+@[-_a-z0-9\.]+)?/, (msg) ->
        user = msg.message.user

        if user.room
            robot.send user, "You can only register via a PM"
        else if email = msg.match[1]
            if user.id is undefined
                next_id = 0

                for own user_id, u of brain.data.users
                    next_id = user_id if user_id > next_id

                user.id = next_id + 1

            user.email_address = email
            brain.data.users[user.id or user.name] = user

            robot.send user, "You have been registered"
        else
            robot.send user, "You must provide an email address to register"
